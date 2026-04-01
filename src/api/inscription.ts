/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import type { User, Colline, Profession, Parent, Highschool, Certificate, Training, TrainingCenter, Country, University, Faculty, Department, UniversityDegree, Class, Section } from '../types/inscription.d';
import type { AcademicYear } from '@/modules/admin/types';
import type { QueryParams } from '@/types';
import { notify } from '@/lib';
import { getListApi } from './getListApi';

// Users
export const useUsers = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async (): Promise<User[]> => {
      const response = await axios.get('/users/', { params });
      return Array.isArray(response.data) ? response.data : response.data.data || response.data.results || [];
    }
  });
};

// Collines
export const useCollines = () => {
  return useQuery({
    queryKey: ['collines'],
    queryFn: async (): Promise<Colline[]> => {
      const response = await axios.get('/geo/collines/');
      return response.data.data || response.data.results || [];
    }
  });
};

// Professions
export const useProfessions = (params: QueryParams) => {
  return useQuery({
    queryKey: ['professions'],
    queryFn: async (): Promise<Profession[]> => {
      const response = await axios.get('/student/professions/', { params });
      return response.data.data || response.data.results || [];
    }
  });
};

// Parents
export const useParents = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['parents', params],
    queryFn: async (): Promise<Parent[]> => {
      const response = await axios.get('/student/parents/', { params });
      return response.data.data || response.data.results || [];
    }
  });
};

export const getSectionsApi = (parms: QueryParams) => getListApi<Section>(axios, "/student/sections/", parms);
// Sections
export const useSections = (params: QueryParams) => {
  return useQuery({
    queryKey: ['sections', params],
    queryFn: () => getSectionsApi(params),
  });
};

export const getHighschoolsApi = (parms?: QueryParams) => getListApi<Highschool>(axios, "/student/highschools/", parms);
// Highschools
export const useHighschools = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['highschools', params],
    queryFn: () => getHighschoolsApi(params),
  });
};
export const getHighschoolsByIdApi = async (id: string, params?: QueryParams): Promise<Highschool> => {
  const response = await axios.get(`/student/highschools/${id}/`, { params });
  return response.data.data;
}
// Highschools by id
export const useHighschoolsById = (id: string, params?: QueryParams) => {
  return useQuery({
    queryKey: ['highschools', params, id],
    queryFn: () => getHighschoolsByIdApi(id, params),
  });
};

export const getCertificatesApi = (parms?: QueryParams) => getListApi<Certificate>(axios, "/student/certificates/", parms);

// Certificates by id
export const useCertificates = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => getCertificatesApi(params),
  });
};

export const getCertificatesByIdApi = async (id: string, params?: QueryParams): Promise<Certificate> => {
  const response = await axios.get(`/student/certificates/${id}`, { params });
  return response.data.data;

}

export const useCertificatesById = (id: string, params?: QueryParams) => {
  return useQuery({
    queryKey: ['certificates', params, id],
    queryFn: () => getCertificatesByIdApi(id, params),
  });
};

// Trainings
export const useTrainings = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['trainings', params],
    queryFn: async (): Promise<Training[]> => {
      const response = await axios.get('/student/trainings/', { params });
      return response.data.data || response.data.results || [];
    }
  });
};

export const getTrainingCentersApi = (params?: QueryParams) =>
  getListApi<TrainingCenter>(axios, '/student/training-centers/', params);

export const useTrainingCenters = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['training-centers', params],
    queryFn: () => getTrainingCentersApi(params),
  });
};

// Countries
export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const response = await axios.get('/geo/countries/');
      return response.data.data || response.data.results || [];
    }
  });
};

// Universities (tous ou filtrés par pays)
export const useUniversities = (countryId?: string) => {
  return useQuery({
    queryKey: ['universities', countryId],
    queryFn: async (): Promise<University[]> => {
      const url = countryId
        ? `/academic/universities/?country_id=${countryId}`
        : '/academic/universities/';
      const response = await axios.get(url);
      return response.data.data || response.data.results || [];
    },
    enabled: countryId ? !!countryId : true
  });
};

// Faculties (toutes ou filtrées par université)
export const useFaculties = (universityId?: string) => {
  return useQuery({
    queryKey: ['faculties', universityId],
    queryFn: async (): Promise<Faculty[]> => {
      const url = universityId
        ? `/academic/faculties/?university_id=${universityId}`
        : '/academic/faculties/';
      const response = await axios.get(url);
      return response.data.data || response.data.results || [];
    },
    enabled: universityId ? !!universityId : true
  });
};

// Departments (tous ou filtrés par faculté)
export const useDepartmentsByFaculty = (facultyId?: string) => {
  return useQuery({
    queryKey: ['departments', facultyId],
    queryFn: async (): Promise<Department[]> => {
      const url = facultyId
        ? `/academic/departments/?faculty_id=${facultyId}`
        : '/academic/departments/';
      const response = await axios.get(url);
      return response.data.data || response.data.results || [];
    },
    enabled: facultyId ? !!facultyId : true
  });
};

// Departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<Department[]> => {
      const response = await axios.get('/academic/departments/');
      return response.data.data || response.data.results || [];
    }
  });
};

// University Degrees
export const useUniversityDegrees = () => {
  return useQuery({
    queryKey: ['university-degrees'],
    queryFn: async (): Promise<UniversityDegree[]> => {
      const response = await axios.get('/academic/degrees/');
      return response.data.data || response.data.results || [];
    }
  });
};

// Academic Years
export const useAcademicYears = () => {
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: async (): Promise<AcademicYear[]> => {
      const response = await axios.get('/academic/academic-years/');
      return response.data.data || response.data.results || [];
    }
  });
};

// Classes
export const useClasses = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: async (): Promise<Class[]> => {
      try {
        const response = await axios.get('/academic/classes/', { params });
        return response.data.data || response.data.results || [];
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'Une erreur est survenue lors du chargement des classes';

        notify.error(message);
        throw error;
      }
    }
  });
};

export const getClassByIdApi = async (id: string, params?: QueryParams): Promise<Class> => {
  const response = await axios.get(`/academic/classes/${id}/`, { params });
  return response.data.data;
};

export const useClassesById = (id: string, params?: QueryParams) => {
  return useQuery({
    queryKey: ['classes', params, id],
    queryFn: () => getClassByIdApi(id, params),
    enabled: Boolean(id),
  });
};

// Search student by matricule to get parents
export const useStudentByMatricule = (
  matricule: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['student-matricule', matricule],
    queryFn: async () => {
      const { data } = await axios.get(`/student/${matricule}/siblings/`);
      const rawData = data.data.parents


      // Si la réponse est un tableau, on transforme chaque élément
      if (Array.isArray(rawData)) {
        return rawData.map(transformToParent);
      }
      // Si c'est un objet unique
      return rawData.map(transformToParent);
    },
    enabled: options?.enabled ?? false,
  });
};

/**
 * Fonction de transformation (Mapper)
 * Intercepte le format API et le convertit en interface Parent
 */
const transformToParent = (data: any): Parent => {
  return {
    id: data.id,
    parent_name: data.name,
    parent_phone: data.phone,
    parent_email: data.email || undefined,
    profession: data.profession, // Assure-toi que le type correspond à ton enum Profession
    parent_type: mapTypeToCode(data.type),
    is_alive: data.is_alive,
    is_contact_person: data.is_contact_person,
    // profession_id n'étant pas dans ta réponse API, on peut l'omettre ou mettre null
  };
};

/**
 * Helper pour transformer 'Father'/'Mother' en 'F'/'M'/'G'
 */
const mapTypeToCode = (type: string): 'F' | 'M' | 'G' => {
  switch (type?.toLowerCase()) {
    case 'father': return 'F';
    case 'mother': return 'M';
    default: return 'G'; // Guardian / tuteur
  }
};
