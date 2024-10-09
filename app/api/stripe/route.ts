import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);
const host = process.env.NEXT_PUBLIC_HOST;

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const date = new Date().toISOString();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "INV-" + date,
            },
            unit_amount: body?.amount * 100 || 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      cancel_url: `${host}`,
      success_url: `${host}/success`,
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
}
