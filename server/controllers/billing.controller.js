import { PLANS } from "../config/plan.js";
import strip from "../config/strip.js";

export const billing = async (req, res) => {
  try {
    const { planType } = req.body;
    const userID = req.user._id;
    const plan = PLANS[planType];
    if (!plan || plan.price == 0) {
      return res.status(400).json({ message: "Invalid paid plan" });
    }
    const session = await strip.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "npr",
            product_data: {
              name: `Webbuilder.ai ${planType.toUpperCase()} plan`,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userID: userID.toString(),
        credits: plan.credits,
        plan: plan.plan,
      },
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    return res.status(200).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    console.log(errorrror);
    return res.status(500).json({ message: `billiing error ${error}` });
  }
};
