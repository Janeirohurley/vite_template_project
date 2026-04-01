/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@/lib/axios';
import type { DjangoSuccessResponse, ApiError, QueryParams } from '@/types/api';
import type {
  Student,
  CreateStudentData,
  StudentsParams,
  CreateInscriptionData,
  UpdateInscriptionData,
  Parent,
  CreateParentData,
  Profession,
  Training,
  StudentHsInfo,
  CreateStudentHsInfoData,
  StudentGraduateInfo,
  CreateStudentGraduateInfoData,
  PopulationParams,
  PopulationData,
  HighSchool,
  CreateHighSchoolData,
  UpdateHighSchoolData,
} from '../types';
import type { User } from '@/types';
import type { DashboardStats, Inscription, StudentFile, StudentFileUpload } from '@/types/inscription';
import { getListApi } from '@/api/getListApi';



export const getInscriptionsApi = (params?: QueryParams) => getListApi<Inscription>(axios, "/student/inscriptions/", params)

// export const getStudentServiceStatsApi = () => axios.get<DjangoSuccessResponse<any>>("/dashboard/student-services/stats/").then(res => res.data.data)
export const getStudentServiceStatsApi = async (params?: QueryParams): Promise<DashboardStats> =>
  (await axios.get<DjangoSuccessResponse<DashboardStats>>("/dashboard/student-services/dashboard-stats/", { params })).data.data;

export async function createInscriptionApi(data: CreateInscriptionData): Promise<Inscription> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Inscription>>(
      '/student/inscriptions/',
      data
    );

    return response.data.data as unknown as Inscription;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function updateInscriptionApi(id: string, data: UpdateInscriptionData): Promise<Inscription> {
  try {
    const response = await axios.patch<DjangoSuccessResponse<Inscription>>(
      `/student/inscriptions/${id}/`,
      data
    );

    return response.data.data as unknown as Inscription;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteInscriptionApi(id: string) {
  try {
    const response = await axios.delete(
      `/student/inscriptions/${id}/`
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
export async function activateInscriptionApi(id: string) {
  try {
    const response = await axios.post(
      `/student/inscriptions/${id}/activate/`
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}


export async function repleceInscriptionApi(id: string, class_fk_id: string) {
  try {
    const response = await axios.post(
      `/student/inscriptions/${id}/replace/`,
      { new_class_id: class_fk_id }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export const getStudentsApi = (params?: StudentsParams) => getListApi<Student>(axios, "/student/students/", params)

export async function getStudentByIdApi(id: string): Promise<Student> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Student>>(
      `/student/students/${id}/`
    );

    return response.data.data as unknown as Student;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createStudentApi(data: CreateStudentData): Promise<Student> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Student>>(
      '/student/create/',
      data
    );

    return response.data.data as unknown as Student;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
export async function deleteStudentApi(id: string): Promise<void> {
  try {
    await axios.delete(`/student/students/${id}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// Generic API call for inscription process steps
export async function submitInscriptionStepApi<T = any>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await axios.post<DjangoSuccessResponse<T>>(
      endpoint,
      data
    );

    return response.data.data as unknown as T;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== PARENTS ====================
export async function getParentsApi(): Promise<Parent[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Parent[]>>(
      '/student/parents/'
    );

    return response.data.data as unknown as Parent[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
export const getParentsListApi = (params?: QueryParams) => getListApi<Parent>(axios, "/student/parents/", params)

// ==================== HIGHSCHOOLS ====================
export const getHighSchoolsApi = (params?: QueryParams) =>
  getListApi<HighSchool>(axios, "/student/highschools/", params);

export async function createHighSchoolApi(data: CreateHighSchoolData): Promise<HighSchool> {
  const response = await axios.post<DjangoSuccessResponse<HighSchool>>('/student/highschools/', data);
  return response.data.data as unknown as HighSchool;
}

export async function updateHighSchoolApi(id: string, data: UpdateHighSchoolData): Promise<HighSchool> {
  const response = await axios.patch<DjangoSuccessResponse<HighSchool>>(`/student/highschools/${id}/`, data);
  return response.data.data as unknown as HighSchool;
}

export async function deleteHighSchoolApi(id: string): Promise<void> {
  await axios.delete(`/student/highschools/${id}/`);
}

export async function createParentApi(data: CreateParentData): Promise<Parent> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Parent>>(
      '/student/parents/',
      data
    );

    return response.data.data as unknown as Parent;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== PROFESSIONS ====================
export async function getProfessionsApi(): Promise<Profession[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Profession[]>>(
      '/student/professions/'
    );

    return response.data.data as unknown as Profession[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== TRAININGS ====================
export async function getTrainingsApi(): Promise<Training[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<Training[]>>(
      '/student/trainings/'
    );

    return response.data.data as unknown as Training[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export interface CreateTrainingData {
  domaine: string;
  certificate: string;
  training_center: string;
}

export async function createTrainingApi(data: CreateTrainingData): Promise<Training> {
  try {
    const response = await axios.post<DjangoSuccessResponse<Training>>(
      '/student/trainings/',
      data
    );

    return response.data.data as unknown as Training;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== STUDENT HS INFO ====================
export async function getStudentHsInfoApi(): Promise<StudentHsInfo[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<StudentHsInfo[]>>(
      '/student/student-hs-info/'
    );

    return response.data.data as unknown as StudentHsInfo[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createStudentHsInfoApi(data: CreateStudentHsInfoData): Promise<StudentHsInfo> {
  try {
    const response = await axios.post<DjangoSuccessResponse<StudentHsInfo>>(
      '/student/student-hs-info/',
      data
    );

    return response.data.data as unknown as StudentHsInfo;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== USERS ====================
export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender?: string | null;
  phone_number?: string | null;
  birth_date?: string | null;
  nationality?: string | null;
  marital_status?: string | null;
  email_verified?: boolean;
  role?: any;
  residence_ids?: string[]
}

export async function createUserApi(data: CreateUserData): Promise<User> {
  try {
    const response = await axios.post<DjangoSuccessResponse<User>>(
      '/users/',
      data
    );

    return response.data.data as unknown as User;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== STUDENT GRADUATE INFO ====================
export async function getStudentGraduateInfoApi(): Promise<StudentGraduateInfo[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<StudentGraduateInfo[]>>(
      '/student/student-graduate-info/'
    );

    return response.data.data as unknown as StudentGraduateInfo[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function createStudentGraduateInfoApi(data: CreateStudentGraduateInfoData): Promise<StudentGraduateInfo> {
  try {
    const response = await axios.post<DjangoSuccessResponse<StudentGraduateInfo>>(
      '/student/student-graduate-info/',
      data
    );

    return response.data.data as unknown as StudentGraduateInfo;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== STUDENT FILES ====================
export async function getStudentFilesApi(studentId: string): Promise<StudentFile[]> {
  try {
    const response = await axios.get<DjangoSuccessResponse<StudentFile[]>>(
      `/student/student-file/?student=${studentId}`
    );

    return response.data.data as unknown as StudentFile[];
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function uploadStudentFilesApi(studentId: string, files: StudentFileUpload[], studentData?: any): Promise<StudentFile[]> {
  try {
    const uploadedFiles: StudentFile[] = [];

    // Envoyer chaque fichier séparément
    for (const fileUpload of files) {
      const formData = new FormData();
      formData.append('file', fileUpload.file);
      formData.append('file_type', fileUpload.file_type);
      formData.append('file_name', fileUpload.file_name);
      formData.append('student', studentId);
      if (fileUpload.notes) {
        formData.append('notes', fileUpload.notes);
      }

      // Ajouter des données JSON si fournies
      if (studentData) {
        formData.append('student_data', JSON.stringify(studentData));
      }

      const response = await axios.post<DjangoSuccessResponse<StudentFile>>(
        '/student/student-file/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      uploadedFiles.push(response.data.data as unknown as StudentFile);
    }

    return uploadedFiles;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

export async function deleteStudentFileApi(fileId: string): Promise<void> {
  try {
    await axios.delete(`/student/student-file/${fileId}/`);
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}

// ==================== POPULATIONS ====================
/**
 * Récupère les données de population étudiante avec filtrage et pagination côté serveur.
 * @param params - Paramètres de filtrage et pagination
 */


export const getPopulationsApi = (params?: QueryParams) => getListApi<PopulationData>(axios, "/dashboard/student-services/population-data/", params);

/**
 * Exporte les données de population au format spécifié.
 * @param params - Paramètres de filtrage (mêmes que getPopulationsApi)
 * @param format - Format d'export ('csv' | 'excel' | 'pdf')
 */
export async function exportPopulationsApi(
  params?: PopulationParams,
  format: 'csv' | 'excel' | 'pdf' = 'excel'
): Promise<Blob> {
  try {
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value !== undefined)
    ) : {};

    const response = await axios.get(
      '/student/populations/export/',
      {
        params: { ...cleanParams, format },
        responseType: 'blob',
      }
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { formattedError?: ApiError };
    if (axiosError.formattedError) {
      throw axiosError.formattedError;
    }
    throw error;
  }
}
