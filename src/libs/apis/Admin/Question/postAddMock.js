import useApiClient from "../../../useApiClient";
import { useState } from "react";

const usePostAddMock = () => {
  const apiClient = useApiClient();

  const postAddMock = async (year, month, subject, subjectNum, publisher = "기본") => {
    await apiClient
      .post(`/admin/csat/add`, {
        year: year,
        month: month,
        subject: subject,
        subjectNum: subjectNum,
        publisher: publisher,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return { postAddMock };
};

export default usePostAddMock;
