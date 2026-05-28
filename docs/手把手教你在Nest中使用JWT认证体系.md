# 手把手教你在 NestJS 中使用 JWT 认证体系

## 📖 目录

1. [简介](#简介)
2. [什么是 JWT？](#什么是-jwt)
3. [项目初始化](#项目初始化)
4. [安装依赖](#安装依赖)
5. [架构设计](#架构设计)
6. [实现步骤](#实现步骤)
7. [完整实战案例](#完整实战案例)
8. [最佳实践](#最佳实践)
9. [常见问题](#常见问题)
10. [安全建议](#安全建议)

---

## 简介

在现代 Web 应用开发中，**身份认证（Authentication）**和**授权（Authorization）**是不可或缺的核心功能。JWT（JSON Web Token）作为一种轻量级的认证方案，因其无状态、可扩展、跨平台等特性，成为前后端分离架构中的首选方案。

NestJS 作为一个基于 Node.js 的企业级框架，提供了完善的 JWT 集成支持。本文将带你从零开始，手把手构建一个完整的 JWT 认证体系。

### 你将学到什么？

- ✅ JWT 的工作原理和组成结构
- ✅ NestJS 中 JWT 模块的配置与使用
- ✅ 用户注册、登录、Token 刷新完整流程
- ✅ JWT 守卫（Guard）和装饰器（Decorator）的实现
- ✅ Refresh Token 机制实现
- ✅ RBAC 权限控制集成
- ✅ 生产环境最佳实践和安全建议

---

## 什么是 JWT？

### JWT 结构

JWT 由三部分组成，用点号（`.`）分隔：

```
Header.Payload.Signature
```

#### 1. Header（头部）

包含 token 类型和加密算法：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload（载荷）

包含声明（claims），即用户信息和元数据：

```json
{
  "sub": "1234567890",
  "username": "zhangsan",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

常用声明：
- `sub` (subject): 主题，通常是用户 ID
- `iat` (issued at): 签发时间
- `exp` (expiration time): 过期时间
- `iss` (issuer): 签发者
- `aud` (audience): 受众

#### 3. Signature（签名）

对前两部分的签名，用于验证 token 未被篡改：

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### JWT 工作流程

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │  Server  │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                     │                    │
     │  1. 登录请求         │                    │
     │  (username/password)│                    │
     ├────────────────────>│                    │
     │                     │  2. 验证用户        │
     │                     ├───────────────────>│
     │                     │                    │
     │                     │  3. 返回用户信息    │
     │                     │<───────────────────┤
     │                     │                    │
     │  4. 生成 JWT        │                    │
     │  (Access Token)     │                    │
     │<────────────────────┤                    │
     │                     │                    │
     │  5. 存储 Token      │                    │
     │  (LocalStorage)     │                    │
     │                     │                    │
     │  6. 请求受保护资源   │                    │
     │  (Authorization:    │                    │
     │   Bearer <token>)   │                    │
     ├────────────────────>│                    │
     │                     │  7. 验证 Token     │
     │                     │  (中间件/Guard)    │
     │                     │                    │
     │  8. 返回数据         │                    │
     │<────────────────────┤                    │
     │                     │                    │
```

---

## 项目初始化

### 创建 NestJS 项目

```bash
# 安装 NestJS CLI
npm install -g @nestjs/cli

# 创建新项目
nest new nestjs-jwt-auth

# 进入项目目录
cd nestjs-jwt-auth
```

### 项目结构预览

```
nestjs-jwt-auth/
├── src/
│   ├── auth/                  # 认证模块
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── users/                 # 用户模块
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── common/                # 公共模块
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interceptors/
│   │       └── response.interceptor.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── config/
│       └── configuration.ts
├── .env                       # 环境变量
├── package.json
└── tsconfig.json
```

---

## 安装依赖

```bash
# 核心依赖
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local

# 数据库相关（以 TypeORM + MySQL 为例）
npm install @nestjs/typeorm typeorm mysql2

# 密码加密
npm install bcryptjs
npm install -D @types/bcryptjs

# 配置管理
npm install @nestjs/config class-validator class-transformer

# 开发依赖
npm install -D @types/passport-jwt @types/passport-local
```

---

## 架构设计

### 核心组件说明

| 组件 | 职责 | 文件位置 |
|------|------|----------|
| **AuthModule** | 认证模块入口，整合所有认证相关服务 | `auth/auth.module.ts` |
| **AuthService** | 处理登录、注册、Token 生成等业务逻辑 | `auth/auth.service.ts` |
| **LocalStrategy** | Passport 本地策略，验证用户名密码 | `auth/strategies/local.strategy.ts` |
| **JwtStrategy** | Passport JWT 策略，验证 Token 有效性 | `auth/strategies/jwt.strategy.ts` |
| **JwtAuthGuard** | JWT 守卫，保护路由需要认证 | `auth/guards/jwt-auth.guard.ts` |
| **RolesGuard** | 角色守卫，实现 RBAC 权限控制 | `auth/guards/roles.guard.ts` |
| **UsersService** | 用户 CRUD 操作 | `users/users.service.ts` |
| **User Entity** | 用户数据模型 | `users/entities/user.entity.ts` |

### 认证流程图

```
用户登录流程：
┌─────────────┐
│  POST /auth │
│   /login    │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ LocalStrategy    │ ← 验证用户名密码
│  validate()      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ AuthService      │ ← 生成 Access Token
│  login()         │   和 Refresh Token
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ 返回 Token       │
│ { accessToken,   │
│   refreshToken } │
└──────────────────┘

访问受保护资源：
┌─────────────┐
│ GET /users  │
│  /profile   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ JwtAuthGuard     │ ← 提取并验证 Token
│  canActivate()   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ JwtStrategy      │ ← 解析 Token  payload
│  validate()      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ 执行业务逻辑     │
│ Controller       │
└──────────────────┘
```

---

## 实现步骤

### 步骤 1：配置环境变量

创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nestjs_auth

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 步骤 2：创建配置模块

`src/config/configuration.ts`:

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs_auth',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
});
```

### 步骤 3：创建用户实体

`src/users/entities/user.entity.ts`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude() // 序列化时排除密码字段
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string; // 'admin' | 'user' | 'editor'

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string; // 存储刷新令牌

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 步骤 4：创建用户模块

`src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // 导出供其他模块使用
})
export class UsersModule {}
```

`src/users/users.service.ts`:

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 创建用户
  async create(userData: Partial<User>): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.findByUsername(userData.username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  // 根据 ID 查找用户
  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  // 验证密码
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 保存刷新令牌
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    // 对刷新令牌进行哈希处理后再存储
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // 清除刷新令牌（登出时使用）
  async clearRefreshToken(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }

  // 获取所有用户（排除敏感信息）
  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, refreshToken, ...result } = user;
      return result;
    });
  }
}
```

`src/users/users.controller.ts`:

```typescript
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // 所有路由都需要认证
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { message: '用户不存在' };
    }
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
```

### 步骤 5：创建 DTO（数据传输对象）

`src/auth/dto/login.dto.ts`:

```typescript
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```

`src/auth/dto/register.dto.ts`:

```typescript
import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
```

### 步骤 6：实现 Local Strategy

`src/auth/strategies/local.strategy.ts`:

```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // 自定义用户名字段名
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
```

### 步骤 7：实现 JWT Strategy

`src/auth/strategies/jwt.strategy.ts`:

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    // payload 是 JWT 解码后的内容
    // 这里返回的内容会被添加到 request.user 中
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
```

### 步骤 8：创建 JWT Guard

`src/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 步骤 9：创建 Roles Guard（RBAC）

`src/auth/decorators/roles.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

`src/auth/guards/roles.guard.ts`:

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由上设置的所需角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，直接通过
    if (!requiredRoles) {
      return true;
    }

    // 获取当前用户的角色
    const { user } = context.switchToHttp().getRequest();
    
    // 检查用户角色是否在所需角色列表中
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### 步骤 10：实现认证服务

`src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 验证用户（供 LocalStrategy 调用）
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    
    return null;
  }

  // 登录 - 生成 Token
  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // 生成 Access Token（短期）
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    // 生成 Refresh Token（长期）
    const refreshToken = this.generateRefreshToken();

    // 保存刷新令牌到数据库
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    };
  }

  // 注册
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const { password, refreshToken, ...result } = user;
    return result;
  }

  // 刷新 Token
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('缺少刷新令牌');
    }

    // 从数据库中查找使用该刷新令牌的用户
    const users = await this.usersService.findAll();
    const user = users.find(async (u) => {
      // 注意：实际项目中应该优化这个查询
      return this.usersService.validatePassword(refreshToken, u.refreshToken);
    });

    if (!user) {
      throw new UnauthorizedException('无效的刷新令牌');
    }

    // 生成新的 Access Token
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    // 生成新的 Refresh Token（可选：轮换机制）
    const newRefreshToken = this.generateRefreshToken();
    await this.usersService.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    };
  }

  // 登出
  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { message: '登出成功' };
  }

  // 生成随机刷新令牌
  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }
}
```

### 步骤 11：创建认证控制器

`src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 登录
  @Post('login')
  @UseGuards(AuthGuard('local')) // 使用 LocalStrategy
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // 注册
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // 刷新 Token
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // 登出
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  // 测试受保护的路由
  @Post('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      message: '这是受保护的资源',
      user: req.user,
    };
  }
}
```

### 步骤 12：创建认证模块

`src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### 步骤 13：配置主模块

`src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: true, // 生产环境应设为 false
      }),
      inject: [ConfigService],
    }),
    
    // 业务模块
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
```

### 步骤 14：添加全局异常过滤器（可选但推荐）

`src/common/filters/http-exception.filter.ts`:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

在 `main.ts` 中使用：

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除非装饰器定义的属性
      forbidNonWhitelisted: true, // 如果存在非白名单属性则抛出错误
      transform: true, // 自动转换类型
    }),
  );

  // 启用 CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
```

---

## 完整实战案例

### 案例 1：带角色权限的后台管理系统

```typescript
// admin.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  // 只有管理员可以访问
  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return {
      message: '管理员仪表盘',
      stats: {
        users: 1234,
        orders: 567,
        revenue: 89000,
      },
    };
  }

  // 管理员和编辑可以访问
  @Get('articles')
  @Roles('admin', 'editor')
  getArticles() {
    return {
      message: '文章列表',
      articles: [],
    };
  }

  // 只有管理员可以删除用户
  @Post('users/delete')
  @Roles('admin')
  deleteUser() {
    return { message: '用户已删除' };
  }
}
```

### 案例 2：API 文档装饰器（配合 Swagger）

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '认证失败' })
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('profile')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth() // 标记需要 JWT 认证
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### 案例 3：自定义 JWT Payload

```typescript
// 在 JwtStrategy 中添加更多用户信息
async validate(payload: any) {
  return {
    userId: payload.sub,
    username: payload.username,
    role: payload.role,
    email: payload.email,
    permissions: payload.permissions, // 自定义权限列表
  };
}

// 生成 Token 时包含更多信息
const payload = {
  sub: user.id,
  username: user.username,
  role: user.role,
  email: user.email,
  permissions: ['read', 'write', 'delete'],
};
```

### 案例 4：Token 黑名单机制（Redis）

```typescript
// blacklisted-tokens.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class BlacklistedTokensService {
  constructor(private redisService: RedisService) {}

  // 将 Token 加入黑名单
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    await this.redisService.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
  }

  // 检查 Token 是否在黑名单中
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisService.get(`blacklist:${token}`);
    return result === 'true';
  }
}

// 在 JwtStrategy 中检查
async validate(payload: any) {
  const token = /* 从请求中提取 token */;
  const isBlacklisted = await this.blacklistedTokensService.isBlacklisted(token);
  
  if (isBlacklisted) {
    throw new UnauthorizedException('Token 已被撤销');
  }
  
  return { userId: payload.sub, username: payload.username };
}
```

---

## 最佳实践

### 1. Token 有效期设置

```typescript
// ✅ 推荐配置
JWT_ACCESS_TOKEN_EXPIRES_IN=15m    // Access Token 短期有效
JWT_REFRESH_TOKEN_EXPIRES_IN=7d    // Refresh Token 长期有效

// ❌ 不推荐
JWT_ACCESS_TOKEN_EXPIRES_IN=30d    // 太长，安全风险高
JWT_ACCESS_TOKEN_EXPIRES_IN=1m     // 太短，用户体验差
```

### 2. 密钥管理

```typescript
// ✅ 使用环境变量，不同环境不同密钥
JWT_SECRET=${JWT_SECRET_PRODUCTION}

// ✅ 生产环境使用强密钥（至少 32 字符）
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

// ❌ 硬编码密钥
const secret = 'my-secret';

// ❌ 使用弱密钥
JWT_SECRET=123456
```

### 3. 密码加密

```typescript
// ✅ 使用 bcrypt，salt rounds >= 10
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// ❌ 明文存储
user.password = password;

// ❌ 使用 MD5/SHA1（不安全）
const hash = crypto.createHash('md5').update(password).digest('hex');
```

### 4. 错误处理

```typescript
// ✅ 通用错误消息，避免泄露信息
throw new UnauthorizedException('用户名或密码错误');

// ❌ 具体错误信息
throw new UnauthorizedException('用户名不存在');
throw new UnauthorizedException('密码错误');
```

### 5. HTTPS 强制

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 生产环境强制 HTTPS
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        next();
      } else {
        res.redirect(`https://${req.hostname}${req.url}`);
      }
    });
  }
  
  await app.listen(3000);
}
```

### 6. 速率限制

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,     // 1 分钟
      limit: 10,      // 最多 10 次请求
    }]),
  ],
})
export class AppModule {}
```

### 7. 日志记录

```typescript
// auth.service.ts
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async login(user: any) {
    this.logger.log(`用户 ${user.username} 登录成功`);
    // ...
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.warn(`登录失败：用户 ${username} 不存在`);
      return null;
    }
    // ...
  }
}
```

---

## 常见问题

### Q1: Token 被窃取怎么办？

**解决方案：**
1. 使用 HTTPS 防止中间人攻击
2. Access Token 设置较短有效期（15 分钟）
3. 实现 Refresh Token 轮换机制
4. 可选：实现 Token 黑名单（Redis）
5. 检测异常登录行为（IP 变化、设备变化）

### Q2: 如何实现单点登录（SSO）？

**思路：**
```typescript
// 共享 JWT 密钥
// Service A 和 Service B 使用相同的 JWT_SECRET

// Service A 生成 Token
const token = jwt.sign(payload, sharedSecret);

// Service B 验证 Token
const decoded = jwt.verify(token, sharedSecret);
```

### Q3: Refresh Token 如何安全存储？

**推荐方案：**
```typescript
// 前端：HttpOnly Cookie（防止 XSS）
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,      // 仅 HTTPS
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
});

// 后端：数据库存储哈希值
await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
```

### Q4: 如何处理 Token 过期？

**前端拦截器示例：**
```typescript
// axios 拦截器
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      // 尝试刷新 Token
      try {
        const { data } = await axios.post('/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        
        // 更新 Access Token
        localStorage.setItem('accessToken', data.accessToken);
        
        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // 刷新失败，跳转到登录页
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Q5: JWT vs Session 如何选择？

| 特性 | JWT | Session |
|------|-----|---------|
| 状态 | 无状态 | 有状态 |
| 扩展性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 撤销难度 | 较难（需黑名单） | 容易 |
| 大小 | 较大 | 较小 |
| 适用场景 | 微服务、移动 App | 传统 Web 应用 |

---

## 安全建议

### 🔒 安全检查清单

- [ ] 使用 HTTPS 传输
- [ ] JWT 密钥足够复杂且定期更换
- [ ] Access Token 有效期不超过 15 分钟
- [ ] Refresh Token 存储在 HttpOnly Cookie 中
- [ ] 密码使用 bcrypt 加密（salt >= 10）
- [ ] 实现速率限制防止暴力破解
- [ ] 记录登录日志和异常行为
- [ ] 不在 JWT 中存储敏感信息（如密码、身份证号）
- [ ] 验证 JWT 签名算法（防止 alg: none 攻击）
- [ ] 实现 Token 轮换机制
- [ ] 定期审计和更新依赖包

### 🚫 常见安全陷阱

```typescript
// ❌ 错误：未验证算法
jwt.verify(token, secret);

// ✅ 正确：指定算法
jwt.verify(token, secret, { algorithms: ['HS256'] });

// ❌ 错误：JWT 中包含敏感信息
const payload = {
  userId: 1,
  password: 'hashed_password', // 不要这样做！
};

// ✅ 正确：只包含必要信息
const payload = {
  sub: 1,
  username: 'john',
  role: 'user',
};

// ❌ 错误：忽略 Token 过期
jwt.verify(token, secret, { ignoreExpiration: true });

// ✅ 正确：严格验证过期
jwt.verify(token, secret, { ignoreExpiration: false });
```

---

## 总结

通过本文的学习，你已经掌握了在 NestJS 中构建完整 JWT 认证体系的全流程：

### ✅ 核心知识点回顾

1. **JWT 基础**：理解 Header、Payload、Signature 三部分结构
2. **Passport 集成**：LocalStrategy 验证凭据，JwtStrategy 验证 Token
3. **双 Token 机制**：Access Token（短期）+ Refresh Token（长期）
4. **RBAC 权限控制**：通过 Decorator + Guard 实现角色-based 访问控制
5. **安全防护**：密码加密、HTTPS、速率限制、Token 黑名单

### 🎯 下一步学习方向

- 学习 OAuth 2.0 第三方登录（Google、GitHub）
- 探索多因素认证（MFA/2FA）
- 研究微服务架构下的 JWT 共享方案
- 深入了解 OpenID Connect 协议
- 实践 GraphQL + JWT 认证

### 📚 推荐资源

- [NestJS 官方文档 - Authentication](https://docs.nestjs.com/security/authentication)
- [JWT.io - JWT 调试工具](https://jwt.io)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet_for_Java.html)
- [RFC 7519 - JSON Web Token 标准](https://tools.ietf.org/html/rfc7519)

希望这份指南能帮助你在项目中快速实现安全可靠的 JWT 认证系统！🚀

---

**完整代码示例仓库：**
```bash
git clone https://github.com/yourusername/nestjs-jwt-auth-example.git
cd nestjs-jwt-auth-example
npm install
npm run start:dev
```

**测试 API：**
```bash
# 注册
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456","email":"test@example.com"}'

# 登录
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'

# 访问受保护资源
curl -X POST http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your_access_token>"
```
