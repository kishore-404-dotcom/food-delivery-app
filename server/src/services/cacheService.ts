import redisClient from "../config/redis";



export const getCache = async (
  key: string
) => {

  return await redisClient.get(key);

};



export const setCache = async (
  key: string,
  value: any,
  expiry = 3600
) => {

  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: expiry,
    }
  );

};



export const deleteCache =
  async (key: string) => {

    await redisClient.del(key);

};