import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

function arrayPick(array) {
	const random = Math.floor(Math.random() * array.length);
	return array[random];
}

async function seed() {
	await client.user.create({
		data: {
			username: 'dg',
			passwordHash: await bcrypt.hash('123321', 10)
		}
	});

	const customers = [
		{ name: '顾客1', phone: '18858612341' },
		{ name: '顾客2', phone: '18858612342' },
		{ name: '顾客3', phone: '18858612343' }
	];
	for (const data of customers) {
		await client.customer.create({
			data
		});
	}

	const suppliers = [
		{ name: '供应商1', phone: '18058612341' },
		{ name: '供应商2', phone: '18058612342' },
		{ name: '供应商3', phone: '18058612343' }
	];
	for (const data of suppliers) {
		await client.supplier.create({
			data
		});
	}

	const products = [
		{ name: '鲍鱼5#', price: 40.5 },
		{ name: '鲍鱼6#', price: 45.5 },
		{ name: '鲍鱼7#', price: 50.5 },
		{ name: '鲍鱼8#', price: 55.5 },
		{ name: '鲍鱼9#', price: 60.5 },
		{ name: '鲍鱼10#', price: 65.5 },
		{ name: '鲍鱼11#', price: 70.5 }
	];

	// createMany not support sqlite
	// await client.product.createMany({ data: products });
	for (const data of products) {
		await client.product.create({
			data
		});
	}

	const customer = await client.customer.findMany();
	const supplier = await client.supplier.findMany();
	const product = await client.product.findMany();

	await client.sale.create({
		data: {
			date: new Date('2021-08-13'),
			customer: { connect: { id: customer[0].id } },
			products: {
				create: [
					{ price: 24.00, number: 10, product: { connect: { id: product[0].id } } },
					{ price: 50.00, number: 10.5, product: { connect: { id: product[1].id } } },
					{ price: 33.00, number: 20, product: { connect: { id: product[4].id } } }
				]
			}
		}
	});
	await client.sale.create({
		data: {
			date: new Date('2021-09-23'),
			customer: { connect: { id: customer[1].id } },
			products: {
				create: [
					{ price: 11.00, number: 22, product: { connect: { id: product[2].id } } },
					{ price: 21.55, number: 17.5, product: { connect: { id: product[3].id } } },
					{ price: 101.00, number: 30, product: { connect: { id: product[1].id } } }
				]
			}
		}
	});

	await client.buy.create({
		data: {
			date: new Date('2022-01-03'),
			supplier: { connect: { id: supplier[0].id } },
			products: {
				create: [
					{ price: 22, number: 10, product: { connect: { id: product[0].id } } },
					{ price: 15, number: 10.5, product: { connect: { id: product[1].id } } },
					{ price: 102, number: 20, product: { connect: { id: product[4].id } } }
				]
			}
		}
	});
	await client.buy.create({
		data: {
			date: new Date('2022-12-03'),
			supplier: { connect: { id: supplier[1].id } },
			products: {
				create: [
					{ price: 13.5, number: 22, product: { connect: { id: product[2].id } } },
					{ price: 20.5, number: 17.5, product: { connect: { id: product[3].id } } },
					{ price: 23.5, number: 30, product: { connect: { id: product[1].id } } }
				]
			}
		}
	});
}
seed()
	.then(async () => {
		await client.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await client.$disconnect();
		process.exit(1);
	});
