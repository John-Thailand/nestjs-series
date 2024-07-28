import { Injectable } from '@nestjs/common';

// クラスがDI（依存性注入）コンテナに登録されることを示します
// 今回の例ですと、users.controller.tsでUsersServiceの依存関係として注入している
@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'naoki',
      email: 'test@gmail.com',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'yoshiki',
      email: 'test1@gmail.com',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'rock',
      email: 'test3@gmail.com',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'mush',
      email: 'test4@gmail.com',
      role: 'ENGINEER',
    },
    {
      id: 5,
      name: 'sanji',
      email: 'test5@gmail.com',
      role: 'ADMIN',
    },
  ];

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    return user;
  }

  create(user: {
    name: string;
    email: string;
    role: 'INTERN' | 'ENGINEER' | 'ADMIN';
  }) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(
    id: number,
    updatedUser: {
      name?: string;
      email?: string;
      role?: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updatedUser };
      }
      return user;
    });

    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);

    this.users = this.users.filter((usere) => usere.id !== id);

    return removedUser;
  }
}
