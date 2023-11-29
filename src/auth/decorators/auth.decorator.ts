import { applyDecorators, UseGuards } from "@nestjs/common/decorators";
import { OnlyAdminGuard } from "src/auth/guards/admin.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { TypeRole } from "../auth.interface";

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(role === 'admin' ? UseGuards(JwtAuthGuard, OnlyAdminGuard) : UseGuards(JwtAuthGuard))
