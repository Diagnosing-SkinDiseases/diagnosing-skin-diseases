import { useState, useEffect } from "react";
import {
  apiGetAllGlossaryItems,
  apiCreateGlossaryItem,
  apiDeleteGlossaryItem,
  apiGetGlossaryItem,
  apiUpdateGlossaryItem,
} from "../../../apiControllers/glossaryItemApiController";

console.log("Rendering api tests");

const GlossaryItemApiTests = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const executeApi = async () => {
      let test;
      let targetId = "65cf3622790be1df5b052ce1";

      const createPayload = {
        term: "Book Browser 1",
        definition: "Book to read",
        status: "unpublished",
      };

      const updatePayload = {
        id: "65cf3622790be1df5b052ce1",
        term: "Book Updated 3 Browser",
        definition: "Book to read",
        status: "Published",
      };

      apiUpdateGlossaryItem(updatePayload)
        .then((response) => {
          test = response.data;
          console.log("SUCCESS", test);
        })
        .catch((error) => {
          console.log("ERROR", error);
          test = error;
        });
      console.log("Api request sent");
    };

    executeApi();
  }, []);

  return <>{"GlossaryItem API Tests (Check console) A"}</>;
};

export default GlossaryItemApiTests;
