import {
  MethodType,
  type ResponseMessage,
  type DetailResponseMessage,
} from "../../utils/type";
import { useFetch } from "../use[custom]/useFetch";

const getMethod = {
  method: MethodType.GET,
};

const postMethod = {
  method: MethodType.POST,
};

// ========== TYPES ==========

export interface PermissionDefinition {
  id: string;
  key: string;
  category: string;
  action: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionDefinitionsResponse {
  resultCode: string;
  resultMessage: string;
  data: PermissionDefinition[];
}

export interface RolePermissionsResponse {
  resultCode: string;
  resultMessage: string;
  list: {
    permissions: Record<string, boolean>;
  };
}

export interface CreatePermissionDefinitionDto {
  key: string;
  category: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionDefinitionDto {
  category?: string;
  action?: string;
  description?: string;
  isActive?: boolean;
}

export interface SeedPermissionsDto {
  adminPerms?: Record<string, boolean>;
  monitorPerms?: Record<string, boolean>;
}

export interface SeedPermissionsFromDatabaseDto {
  adminPermKeys?: string[];
  monitorPermKeys?: string[];
}

// ========== HOOKS ==========

/**
 * Get all permissions (role/all)
 */
export const useGetAllPermissions = () => {
  const { data, refetch, loading, error } = useFetch<ResponseMessage, void>({
    url: "/auth/permissions/role/all",
    autoFetch: true,
    config: getMethod,
  });
  return {
    allPermissions: data,
    refetchAllPermissions: refetch,
    loadingAllPermissions: loading,
    errorAllPermissions: error,
  };
};

/**
 * Seed permissions with custom admin/monitor perms
 */
export const useSeedPermissions = () => {
  const { data, refetch, loading } = useFetch<
    ResponseMessage,
    SeedPermissionsDto
  >({
    url: "/auth/permissions/seed",
    autoFetch: false,
    config: postMethod,
  });
  return {
    seedPermissionsData: data,
    seedPermissions: refetch,
    loadingSeedPermissions: loading,
  };
};

/**
 * Seed default permissions
 */
export const useSeedDefaultPermissions = () => {
  const { data, refetch, loading } = useFetch<ResponseMessage, void>({
    url: "/auth/permissions/seed-default",
    autoFetch: false,
    config: postMethod,
  });
  return {
    seedDefaultData: data,
    seedDefaultPermissions: refetch,
    loadingSeedDefault: loading,
  };
};

/**
 * Seed permission definitions
 */
export const useSeedPermissionDefinitions = () => {
  const { data, refetch, loading } = useFetch<ResponseMessage, void>({
    url: "/auth/permissions/definitions/seed",
    autoFetch: false,
    config: postMethod,
  });
  return {
    seedDefinitionsData: data,
    seedPermissionDefinitions: refetch,
    loadingSeedDefinitions: loading,
  };
};

/**
 * Get permission definitions with optional filters
 */
export const useGetPermissionDefinitions = () => {
  //   const queryParams = new URLSearchParams();
  //   if (category) queryParams.append("category", category);
  //   if (isActive !== undefined) queryParams.append("isActive", String(isActive));

  //   const queryString = queryParams.toString();
  const url = "/auth/permissions/definitions";

  const { refetch, loading, error } = useFetch<
    PermissionDefinitionsResponse,
    { category?: string; isActive?: boolean }
  >({
    url,
    autoFetch: false,
    config: getMethod,
  });

  return {
    refetchPermissionDefinitions: refetch,
    loadingPermissionDefinitions: loading,
    errorPermissionDefinitions: error,
  };
};

/**
 * Add a new permission definition
 */
export const useAddPermissionDefinition = () => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<PermissionDefinition>,
    CreatePermissionDefinitionDto
  >({
    url: "/auth/permissions/definitions",
    autoFetch: false,
    config: postMethod,
  });
  return {
    addedPermissionDefinition: data,
    addPermissionDefinition: refetch,
    loadingAddDefinition: loading,
  };
};

/**
 * Update a permission definition
 */
export const useUpdatePermissionDefinition = (id: string) => {
  const { data, refetch, loading } = useFetch<
    DetailResponseMessage<PermissionDefinition>,
    UpdatePermissionDefinitionDto
  >({
    url: `/auth/permissions/definitions/${id}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    updatedPermissionDefinition: data,
    updatePermissionDefinition: refetch,
    loadingUpdateDefinition: loading,
  };
};

/**
 * Delete a permission definition
 */
export const useDeletePermissionDefinition = (id: string) => {
  const { data, refetch, loading } = useFetch<ResponseMessage, void>({
    url: `/auth/permissions/definitions/${id}/delete`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    deleteDefinitionData: data,
    deletePermissionDefinition: refetch,
    loadingDeleteDefinition: loading,
  };
};

/**
 * Seed permissions from database
 */
export const useSeedPermissionsFromDatabase = () => {
  const { data, refetch, loading } = useFetch<
    ResponseMessage,
    SeedPermissionsFromDatabaseDto
  >({
    url: "/auth/permissions/seed-from-database",
    autoFetch: false,
    config: postMethod,
  });
  return {
    seedFromDatabaseData: data,
    seedPermissionsFromDatabase: refetch,
    loadingSeedFromDatabase: loading,
  };
};

/**
 * Get all permissions enum (legacy)
 */
export const useGetAllPermissionsEnum = () => {
  const { data, refetch, loading } = useFetch<RolePermissionsResponse, void>({
    url: "/auth/permissions/type/enum",
    autoFetch: true,
    config: getMethod,
  });
  return {
    permissionsEnum: data,
    refetchPermissionsEnum: refetch,
    loadingPermissionsEnum: loading,
  };
};

/**
 * Get permissions for a specific role
 */
export const useGetPermissionsForRole = (role: "ADMIN" | "MONITOR") => {
  const { data, refetch, loading, error } = useFetch<
    RolePermissionsResponse,
    void
  >({
    url: `/auth/permissions/role/${role}`,
    autoFetch: true,
    config: getMethod,
  });
  return {
    rolePermissions: data,
    refetchRolePermissions: refetch,
    loadingRolePermissions: loading,
    errorRolePermissions: error,
  };
};

/**
 * Update permissions for a specific role
 */
export const useUpdatePermissionsForRole = (role: string) => {
  const { data, refetch, loading } = useFetch<
    ResponseMessage,
    Record<string, boolean>
  >({
    url: `/auth/permissions/role/${role}`,
    autoFetch: false,
    config: postMethod,
  });
  return {
    updateRolePermissionsData: data,
    updateRolePermissions: refetch,
    loadingUpdateRolePermissions: loading,
  };
};
