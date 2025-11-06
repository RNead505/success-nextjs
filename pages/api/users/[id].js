import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      return getUser(req, res, id);
    case 'PUT':
      return updateUser(req, res, id);
    case 'DELETE':
      return deleteUser(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getUser(req, res, id) {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateUser(req, res, id) {
  try {
    const { name, email, password, role, bio, avatar } = req.body;

    const updateData = {
      name,
      email,
      role,
      bio,
      avatar,
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteUser(req, res, id) {
  try {
    await prisma.users.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
