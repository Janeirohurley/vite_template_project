import axios from '@/lib/axios';
import { getListApi } from '@/api/getListApi';
import type { QueryParams } from '@/types';
import type {
  HighSchool,
  CreateHighSchoolData,
  UpdateHighSchoolData,
  Section,
  CreateSectionData,
  UpdateSectionData,
  Certificate,
  CreateCertificateData,
  UpdateCertificateData,
  Option,
  CreateOptionData,
  UpdateOptionData,
  TrainingCenter,
  CreateTrainingCenterData,
  UpdateTrainingCenterData,
} from '../types';

export async function fetchHighSchools(params?: QueryParams) {
  return getListApi<HighSchool>(axios, '/student/highschools/', params);
}

export async function createHighSchool(payload: CreateHighSchoolData) {
  const { data } = await axios.post('/student/highschools/', payload);
  return data.data as HighSchool;
}

export async function updateHighSchool(id: string, payload: UpdateHighSchoolData) {
  const { data } = await axios.patch(`/student/highschools/${id}/`, payload);
  return data.data as HighSchool;
}

export async function deleteHighSchool(id: string) {
  await axios.delete(`/student/highschools/${id}/`);
}

export async function fetchSections(params?: QueryParams) {
  return getListApi<Section>(axios, '/student/sections/', params);
}

export async function createSection(payload: CreateSectionData) {
  const { data } = await axios.post('/student/sections/', payload);
  return data.data as Section;
}

export async function updateSection(id: string, payload: UpdateSectionData) {
  const { data } = await axios.patch(`/student/sections/${id}/`, payload);
  return data.data as Section;
}

export async function deleteSection(id: string) {
  await axios.delete(`/student/sections/${id}/`);
}

export async function fetchCertificates(params?: QueryParams) {
  return getListApi<Certificate>(axios, '/student/certificates/', params);
}

export async function createCertificate(payload: CreateCertificateData) {
  const { data } = await axios.post('/student/certificates/', payload);
  return data.data as Certificate;
}

export async function updateCertificate(id: string, payload: UpdateCertificateData) {
  const { data } = await axios.patch(`/student/certificates/${id}/`, payload);
  return data.data as Certificate;
}

export async function deleteCertificate(id: string) {
  await axios.delete(`/student/certificates/${id}/`);
}

export async function fetchOptions(params?: QueryParams) {
  return getListApi<Option>(axios, '/student/options/', params);
}

export async function createOption(payload: CreateOptionData) {
  const { data } = await axios.post('/student/options/', payload);
  return data.data as Option;
}

export async function updateOption(id: string, payload: UpdateOptionData) {
  const { data } = await axios.patch(`/student/options/${id}/`, payload);
  return data.data as Option;
}

export async function deleteOption(id: string) {
  await axios.delete(`/student/options/${id}/`);
}

export async function fetchTrainingCenters(params?: QueryParams) {
  return getListApi<TrainingCenter>(axios, '/student/training-centers/', params);
}

export async function createTrainingCenter(payload: CreateTrainingCenterData) {
  const { data } = await axios.post('/student/training-centers/', payload);
  return data.data as TrainingCenter;
}

export async function updateTrainingCenter(id: string, payload: UpdateTrainingCenterData) {
  const { data } = await axios.patch(`/student/training-centers/${id}/`, payload);
  return data.data as TrainingCenter;
}

export async function deleteTrainingCenter(id: string) {
  await axios.delete(`/student/training-centers/${id}/`);
}
