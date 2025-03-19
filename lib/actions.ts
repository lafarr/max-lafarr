'use server';

import { createClient } from "@supabase/supabase-js";
import { UTApi } from "uploadthing/server";

enum StreamingPlatform {
	spotify = 'spotify',
	soundcloud = 'soundcloud'
}

export interface Album {
	id?: number;
	title: string;
	album_cover?: string;
	album_cover_key?: string;
	release_date: string;
	streaming_link: string;
	streaming_platform: StreamingPlatform | string;
}

const supabaseUrl = process.env.SUBABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey ?? '')

export async function getSubData() {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { data, error: err } = await supabase
			.from('subscribers')
			.select()

		if (err) {
			console.log(err);
			throw new Error(err?.message || "some error");
		}

		return data?.map(row => {
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
		});
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}

}

export async function deleteSub(id: number) {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { error: err } = await supabase
			.from('subscribers')
			.delete()
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message || "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function getEvents() {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { data, error: err } = await supabase
			.from('events')
			.select()

		if (err) {
			console.log(err);
			throw new Error(err?.message || "some error");
		}

		return data;
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function createEvent(formData: { time: string }) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}

		const { error: err } = await supabase
			.from('events')
			.insert([formData]);

		if (err || !data) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function deleteEvent(id: number | undefined) {
	if (!id) {
		throw new Error('id cannot be undefined');
	}

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}

		const { error: err } = await supabase
			.from('events')
			.delete()
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function getEventById(id: number) {
	if (!id) {
		throw new Error('id cannot be undefined');
	}

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}

		const { data, error: err } = await supabase
			.from('events')
			.select()
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}

		return data[0];
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function updateEventById(id: number, newData: { id?: number, time: string, created_at?: string }) {
	if (!id) {
		throw new Error('id cannot be undefined');
	}

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}


		const { error: err } = await supabase
			.from('events')
			.update({ ...newData, id: undefined, created_at: undefined })
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function createSub(email: string) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}

		const { error: err } = await supabase
			.from('subscribers')
			.insert([{ email }]);

		if (err || !data) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function createAlbum(album: Album, file: File) {
	const utapi = new UTApi({
		token: process.env.UPLOADTHING_TOKEN
	});

	const files = [file];
	let fileUrl, fileKey;
	try {
		const uploadedFiles = await utapi.uploadFiles(files);
		fileUrl = uploadedFiles[0]?.data?.ufsUrl;
		fileKey = uploadedFiles[0]?.data?.key;

		if (!fileUrl)
			throw new Error("The file URL is null for some reason");
	} catch (err: unknown) {
		const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while uploading the file";
		throw new Error(errorMsg);
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
		}

		const { error: err } = await supabase
			.from('albums')
			.insert([{ ...album, album_cover: fileUrl, album_cover_key: fileKey }]);

		if (err || !data) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

		if (fileKey) {
			try {
				await utapi.deleteFiles([fileKey]);
			} catch (err: unknown) {
				console.log(err);
				const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while deleting the file";
				throw new Error(errorMsg);
			}
		}
		throw new Error(errorMessage);
	}
}

export async function getAlbums() {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { data, error: err } = await supabase
			.from('albums')
			.select()

		if (err) {
			console.log(err);
			throw new Error(err?.message || "some error");
		}

		return data?.sort((a, b) => {
			const [aMonth, aYear] = a.release_date.split('/');
			const [bMonth, bYear] = b.release_date.split('/');
			const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1);
			const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1);
			return bDate.getTime() - aDate.getTime();
		});
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function deleteAlbumById(id: number) {
	const utapi = new UTApi({
		token: process.env.UPLOADTHING_TOKEN
	});

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { data, error: err } = await supabase
			.from('albums')
			.delete()
			.eq("id", id)
			.select();

		if (data?.[0]?.album_cover_key) {
			try {
				await utapi.deleteFiles([data[0].album_cover_key]);
			} catch (err: unknown) {
				console.log(err);
				const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while deleting the file";
				throw new Error(errorMsg);
			}

		if (err) {
			console.log(err);
			const errorMsg = (err as Error).message ? (err as Error).message : "An unknown error occurred while deleting the file";
			throw new Error(errorMsg);
		}
	}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function getAlbumById(id: number) {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error(error?.message || "some error");
		}

		const { data, error: err } = await supabase
			.from('albums')
			.select()
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message || "some error");
		}

		return data;
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}

export async function updateAlbumById(id: number, data: Album, file: File | null) {
	if (!id) {
		throw new Error('id cannot be undefined');
	}

	let fileUrl;
	if (file) {
		const utapi = new UTApi({
			token: process.env.UPLOADTHING_TOKEN
		});

		const files = [file];
		try {
			const uploadedFiles = await utapi.uploadFiles(files);
			fileUrl = uploadedFiles[0]?.data?.ufsUrl;

			if (!fileUrl)
				throw new Error("The file URL is null for some reason");
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : "An unknown error occurred while uploading the file";
			console.log(errorMsg);
			throw new Error(errorMsg);
		}
	}

	if (fileUrl) data.album_cover = fileUrl;

	console.log('fileurl')
	console.log(fileUrl);

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: process.env.SUPABASE_EMAIL ?? '',
			password: process.env.SUPABASE_PASSWORD ?? ''
		});

		if (error) {
			console.error('Error signing in:', error.message)
			throw new Error('Error signing in:');
		}

		console.log('updating in the db...')
		const { error: err } = await supabase
			.from('albums')
			.update({ id: undefined, ...data, created_at: undefined })
			.eq("id", id);

		if (err) {
			console.log(err);
			throw new Error(err?.message ?? "some error");
		}
	} catch (error: unknown) {
		console.log(error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		throw new Error(errorMessage);
	}
}
