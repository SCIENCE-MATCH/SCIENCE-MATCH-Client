import useApiClient from "../../../useApiClient";
import { useState, useEffect } from "react";

const useGetTeams = () => {
  const apiClient = useApiClient();
  const [receivedTeams, setData] = useState([]);

  const getDetail = async (id) => {
    try {
      const res = await apiClient.get(`/teacher/team/detail?groupId=${id}`);
      return res.data.data.allStudents.map((stud) => ({ ...stud, selected: false }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getTeams = async () => {
    await apiClient
      .get(`/teacher/team`)
      .then(async (res) => {
        const overallTeams = await Promise.all(
          res.data.data.map(async (team) => {
            return { ...team, extended: false, allSelected: false, students: (await getDetail(team.teamId)) ?? [] };
          })
        );
        setData(overallTeams);
      })
      .catch((err) => console.log(err));
  };

  return { receivedTeams, getTeams };
};

export default useGetTeams;
