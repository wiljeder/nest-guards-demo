import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: string[], strict = false) =>
  SetMetadata('roles', { roles, strict });
