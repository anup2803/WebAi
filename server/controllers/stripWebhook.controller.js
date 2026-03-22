import strip from "../config/strip.js";
import User from "../models/user.model.js";

export const stripWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = strip.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SERET,
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `webhook error ${error}` });
  }
  if (event.type == "checkout.session.completed") {
    const session = event.data.object;
    const userID = session.metadata.userId;
    const credits = Number(session.metadata.credits);
    const plan = session.metadata.plan;

    await User.findByIdAndUpdate(userId, {
      $inc: { credits },
      plan,
    });
  }

  return res.json({ recived: true });
};
