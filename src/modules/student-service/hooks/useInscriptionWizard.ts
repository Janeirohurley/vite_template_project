import { useState } from 'react';
import type { InscriptionFormData } from '../../../types/inscription.d';
import axios from '../../../lib/axios';

export function useInscriptionWizard() {
  const [isLoading, setIsLoading] = useState(false);

  const processInscription = async (data: InscriptionFormData) => {
    setIsLoading(true);
    
    try {
      // Step 1: Create Student
      const studentResponse = await axios.post('/student/students/', {
        user: data.step1.user_id,
        colline: data.step1.colline_id,
        cam: data.step1.cam,
        parent_ids: []
      });

      const student = studentResponse.data;

      // Step 2: Handle Parents
      const parentIds: string[] = [];
      for (const parentData of data.step2.parents) {
        if (parentData.id) {
          // Existing parent
          parentIds.push(parentData.id);
        } else {
          // Create new parent
          const parentResponse = await axios.post('/student/parents/', {
            parent_name: parentData.parent_name,
            parent_phone: parentData.parent_phone,
            parent_email: parentData.parent_email,
            profession_id: parentData.profession_id,
            parent_type: parentData.parent_type,
            is_alive: parentData.is_alive,
            is_contact_person: parentData.is_contact_person
          });

          const newParent = parentResponse.data;
          parentIds.push(newParent.data.id);
        }
      }

      // Update student with parents
      await axios.patch(`/student/students/${student.data.id}/`, { parent_ids: parentIds });

      // Step 3: Create High School Info
      await axios.post('/student/student-hs-info/', {
        student: student.data.id,
        highschool: data.step3.highschool_id,
        certificate: data.step3.certificate_id,
        se_mark: data.step3.se_mark,
        date_of_obtention: data.step3.date_of_obtention,
        formation_ids: data.step3.formation_ids
      });



      // Step 4: Create University Info (if provided)
      if (data.step4) {
        await axios.post('/student/student-graduate-info/', {
          student: student.data.id,
          department: data.step4.department_id,
          option: data.step4.option,
          mention: data.step4.mention,
          degree: data.step4.degree_id
        });


      }

      // Step 5: Create Inscription
      const inscriptionResponse = await axios.post('/student/inscriptions/', {
        student: student.data.id,
        academic_year: data.step5.academic_year_id,
        class_fk_id: data.step5.class_fk_id,
        date_inscription: data.step5.date_inscription,
        regist_status: 'Pending'
      });

      const inscription = inscriptionResponse.data;

      // // Step 6: Create Student Card
      // await axios.post('/student/student-cards/', {
      //   student: student.data.id,
      //   issue_date: data.step5.date_inscription,
      //   expiry_date: new Date(new Date(data.step5.date_inscription).getFullYear() + 1, 11, 31).toISOString().split('T')[0]
      // });



      return {
        success: true,
        data: {
          student: student.data,
          inscription: inscription.data,
          matricule: inscription.data.student?.matricule
        }
      };

    } catch (error) {
      console.error('Inscription error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processInscription,
    isLoading
  };
}