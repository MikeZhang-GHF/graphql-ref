import { connection } from './connection.js';
import DataLoader from 'dataloader';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('Loading companies', ids);
    const companies = await getCompanyTable().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}