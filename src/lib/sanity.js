import { createClient } from '@sanity/client';
import { SANITY_API_TOKEN } from '$env/static/private';

export const sanityClient = createClient({
  projectId: 'sy4ovumo',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true
});

// 查詢所有訂閱 - 匹配實際 schema
export async function getSubscriptions() {
  const query = `*[_type == "subscription"] | order(nextdate asc) {
    _id,
    name,
    site,
    price,
    nextdate,
    note,
    account
  }`;
  
  return await sanityClient.fetch(query);
}

// 查詢單個訂閱 - 匹配實際 schema
export async function getSubscription(id) {
  const query = `*[_type == "subscription" && _id == $id][0] {
    _id,
    name,
    site,
    price,
    nextdate,
    note,
    account
  }`;
  
  return await sanityClient.fetch(query, { id });
}

// 更新訂閱
export async function updateSubscription(id, data) {
  return await sanityClient
    .patch(id)
    .set(data)
    .commit();
}

// 刪除訂閱
export async function deleteSubscription(id) {
  return await sanityClient.delete(id);
}

// 建立訂閱
export async function createSubscription(data) {
  return await sanityClient.create({
    _type: 'subscription',
    ...data
  });
}

// 食品相關函數
export async function getFoods() {
  const query = `*[_type == "food"] | order(_createdAt desc) {
    _id,
    name,
    amount,
    price,
    shop,
    todate,
    photourl,
    photo,
    photohash,
    category,
    unit,
    purchaseDate,
    status,
    note,
    _createdAt,
    _updatedAt
  }`;
  
  return await sanityClient.fetch(query);
}

export async function getFood(id) {
  const query = `*[_type == "food" && _id == $id][0] {
    _id,
    name,
    amount,
    price,
    shop,
    todate,
    photourl,
    photo,
    photohash,
    category,
    unit,
    purchaseDate,
    status,
    note
  }`;
  
  return await sanityClient.fetch(query, { id });
}

export async function createFood(data) {
  return await sanityClient.create({
    _type: 'food',
    ...data
  });
}

export async function updateFood(id, data) {
  return await sanityClient
    .patch(id)
    .set(data)
    .commit();
}

export async function deleteFood(id) {
  return await sanityClient.delete(id);
}
