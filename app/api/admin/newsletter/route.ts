import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import nodemailer from 'nodemailer';

// TODO: Create app password for jlafarr99@gmail.com
async function sendNewsletter(allRecipients: string[], subject: string, htmlContent: string): Promise<void> {
	const batches = [];
	const batchSize = 80;
	const email = process.env.EMAIL;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: email,
			pass: process.env.GMAIL_APP_PASSWORD // Use an app password, not your regular password
		}
	});

	for (let i = 0; i < allRecipients.length; i += batchSize) {
		batches.push(allRecipients.slice(i, i + batchSize));
	}

	console.log(`Sending ${batches.length} batches of emails...`);

	for (let i = 0; i < batches.length; i++) {
		const batchRecipients = batches[i];
		console.log(`Sending batch ${i + 1} with ${batchRecipients.length} recipients`);

		// Setup email options with current batch
		const mailOptions = {
			from: email,
			to: email,
			bcc: batchRecipients.join(','),
			subject: subject,
			html: htmlContent
		};

		try {
			const info = await transporter.sendMail(mailOptions);
			console.log(`Batch ${i + 1} sent: ${info.messageId}`);

			if (i < batches.length - 1) {
				console.log('Waiting before sending next batch...');
				await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
			}
		} catch (error) {
			console.error(`Error sending batch ${i + 1}:`, error);
		}
	}
}

export async function POST(req: NextRequest) {
	const supabaseUrl = process.env.SUBABASE_URL ?? '';
	const supabaseKey = process.env.SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey ?? '')
	const { htmlContent, subject } = await req.json();

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			return new Response(JSON.stringify({ error: error?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const { data, error: err } = await supabase
			.from('subscribers')
			.select('email');

		if (err) {
			console.log(err);
			return new Response(JSON.stringify({ error: err?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const values: string[] = data?.map(row => row['email']) as string[] ?? [];

		try {
			await sendNewsletter(values, subject, htmlContent);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			console.log(err);
			return new Response(JSON.stringify({ error: msg }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}


		return new Response(JSON.stringify({ message: 'Newsletter sent.' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function GET() {
	const supabaseUrl = process.env.SUBABASE_URL ?? '';
	const supabaseKey = process.env.SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey ?? '')

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			return new Response(JSON.stringify({ error: error?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const { data, error: err } = await supabase
			.from('subscribers')
			.select()

		if (err) {
			console.log(err);
			return new Response(JSON.stringify({ error: err?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const values: { id: number, email: string, createdAt: string }[] = data?.map(row => {
			const createdAtDate: Date = new Date(row['created_at']);
			const createdAt = new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate()).toISOString();
			const normalDate = createdAt.split('T')[0];
			const dateStuff = normalDate.split("-");
			const year = dateStuff[0];
			let month = dateStuff[1];
			let day = dateStuff[2];

			if (month.startsWith('0')) {
				month = month.slice(1);
			}

			if (day.startsWith('0')) {
				day = day.slice(1);
			}

			const dateString = `${month}-${day}-${year}`;

			return { id: row['id'], email: row['email'], createdAt: dateString };
		}) as { id: number, email: string, createdAt: string }[] ?? [];

		return new Response(JSON.stringify({ subscribers: values }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

}

export async function DELETE(req: NextRequest) {
	const supabaseUrl = process.env.SUBABASE_URL ?? '';
	const supabaseKey = process.env.SUPABASE_KEY;
	const supabase = createClient(supabaseUrl, supabaseKey ?? '')
	const { id }: { id: number } = await req.json();

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			return new Response(JSON.stringify({ error: error?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const { error: err } = await supabase
			.from('subscribers')
			.delete()
			.eq("id", id);

		if (err) {
			console.log(err);
			return new Response(JSON.stringify({ error: err?.message || "some error" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ message: 'Record deleted.' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
