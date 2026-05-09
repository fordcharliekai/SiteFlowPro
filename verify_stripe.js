const Stripe = require('stripe');
const fs = require('fs');

async function verifyStripe() {
    let env = {};
    try {
        const data = fs.readFileSync('.env.local', 'utf8');
        data.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
    } catch (e) {
        console.error("No .env.local found");
    }

    const secretKey = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    const priceId = env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID_MONTHLY;

    console.log(`Checking Secret Key: ${secretKey ? secretKey.substring(0, 7) + '...' : 'MISSING'}`);
    console.log(`Checking Price ID: ${priceId ? priceId : 'MISSING'}`);

    if (!secretKey || secretKey.includes('dummy') || secretKey.includes('sk_test_*ummy')) {
        console.log("WARNING: STRIPE_SECRET_KEY is a dummy placeholder.");
        return;
    }

    const stripe = new Stripe(secretKey);

    try {
        const price = await stripe.prices.retrieve(priceId);
        console.log("Price verification SUCCESS:");
        console.log(`ID: ${price.id}`);
        console.log(`Active: ${price.active}`);
        console.log(`Type: ${price.type}`);
        console.log(`Recurring: ${JSON.stringify(price.recurring)}`);
    } catch (err) {
        console.error("Price verification FAILED:");
        console.error(err.message);
    }
}

verifyStripe();
