import client from "./prismaClient";

const getUserId = async (email) => {
  if (!email || typeof email !== "string") return null;

  try {
    const { id } = await client.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    return id;
  } catch (error) {
    return null;
  }
};

export default getUserId;
