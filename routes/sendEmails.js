const cron = require('node-cron');
const express = require('express');
const Resend = require('resend').Resend;
const router = express.Router();
const Alumni = require("../models/alumni");
const PrevAlumni = require("../models/prevalumni");
const Subscriber = require('../models/subscribers');
const ldap = require('ldapjs');

let emailSchedule = null;
const resend = new Resend('re_MrGDdqKt_LzmC7r9zFByqWbzwVE741LLM');


// jest.mock('node-cron', () => ({
//     schedule: jest.fn(() => ({
//         destroy: jest.fn(),
//     })),
// }));


// Get Email of the employees from UC Davis servers
async function getEmails(remote_user) {
    const client = ldap.createClient({
        url: "ldaps://ldap.ucdavis.edu:636",
    });

    // Define the search base and filter
    const searchBase = "ou=People,dc=ucdavis,dc=edu";
    const searchFilter = "(uid=" + remote_user + ")";
    let mail = null;
    let displayName = null;

    try {
        // Perform the search
        client.search(
            searchBase,
            { filter: searchFilter, scope: "sub" },
            (err, res) => {
                if (err) {
                    console.error("Error performing search:", err);
                    return;
                }

                res.on("searchEntry", (entry) => {
                    console.log("entry: " + entry.pojo);
                    entry.pojo.attributes.forEach((attribute) => {
                        if (attribute.type === "mail") {
                            mail = attribute.values[0]; // Assuming only one value
                        } else if (attribute.type === "displayName") {
                            displayName = attribute.values[0]; // Assuming only one value
                        }
                    });
                });

                res.on("error", (err) => {
                    console.error("error: " + err.message);
                });

                res.on("end", (result) => {
                    console.log("status: " + result.status);
                    return mail, displayName;
                });
            }
        );
    } catch (error) {
        console.error("An error occurred:", error);
        return "Not Found", "Not Found";
    }
}

// Route to check if a user's email is subscribed
router.get('/check-subscription', async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const subscriber = await Subscriber.findOne({ email });
      if (!subscriber) {
        return res.json({ subscribed: false });
      }
  
      res.json({ subscribed: subscriber.subscribed });
    } catch (error) {
      console.error('Error checking subscription:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

const compareAlumni = async () => {
    try {
        const currentAlumni = await Alumni.find();
        const previousAlumni = await PrevAlumni.find();

        const changes = [];
        currentAlumni.forEach((current) => {
            const previous = previousAlumni.find(
                (prev) =>
                    prev.name === current.name &&
                    prev.major === current.major &&
                    prev.graduationYear === current.graduationYear &&
                    prev.url === current.url
            );
            if (!previous) {
                return;
            } else {
                if (current.job !== previous.job && current.company === previous.company) {
                    changes.push(
                        `${current.name} has changed position from ${previous.job} to ${current.job} at ${current.company}.`
                    );
                }
                if (current.company !== previous.company) {
                    changes.push(
                        `${current.name} moved companies from ${previous.company} to ${current.company}.`
                    );
                }
                if (current.location !== previous.location) {
                    changes.push(
                        `${current.name} changed location from ${previous.location} to ${current.location}.`
                    );
                }
                if (current.company !== previous.company) {
                    changes.push(
                        `${current.name} has started a new job at ${current.company} as a ${current.job}.`
                    );
                }
            }
        });
        return changes;
    } catch (error) {
        throw new Error("Error comparing alumni data.");
    }
};

// Schedule email sending
const scheduleEmails = () => {
    emailSchedule = cron.schedule('0 0 1 * *', async () => {
        try {
            const alumniUpdates = await compareAlumni();
            const subscribers = await Subscriber.find({ subscribed: true });
            subscribers.forEach(async (subscriber) => {
                const message = {
                    from: 'onboarding@resend.dev',
                    to: subscriber.email,
                    subject: 'Monthly Updates',
                    html: `<p>Here are the monthly updates:</p>${alumniUpdates.map(update => `<p>${update}</p>`).join('')}`,
                };
                await resend.emails.send(message);
            });
        } catch (error) {
            console.error('Error scheduling email sending:', error);
        }
    });
};

// Subscribe to email notifications
router.post('/subscribe', async (req, res) => {
    try {
        const remote_user = req.headers['remote_user'];
        let email = "Not Found";
        let name = "Not Found";
        if (!remote_user) {
            // email, name  = req.body;
        } else {
            email, name = await getEmails(remote_user);
        }
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            subscriber.subscribed = true;
            await subscriber.save();
        } else {
            subscriber = new Subscriber({
                email,
                name,
                subscribed: true,
            });
            await subscriber.save();
        }

        if (!emailSchedule) {
            scheduleEmails();
        }

        const welcomeMessage = {
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Welcome, ${name}!`,
            html: `<p>Thank you for subscribing to our monthly updates!</p>`,
        };
        await resend.emails.send(welcomeMessage);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error subscribing to email notifications:', error);
        res.sendStatus(500);
    }
});

// Unsubscribe from email notifications
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            subscriber.subscribed = false;
            await subscriber.save();
        } else {
            return res.status(404).json({ message: 'Subscriber not found.' });
        }

        const subscribedCount = await Subscriber.countDocuments({ subscribed: true });
        if (emailSchedule && subscribedCount === 0) {
            emailSchedule.destroy();
            emailSchedule = null;
        }

        const farewellMessage = {
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Goodbye!',
            html: `<p>We're sorry to see you go! You have been unsubscribed from our monthly updates.</p>`,
        };
        await resend.emails.send(farewellMessage);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error unsubscribing from email notifications:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
