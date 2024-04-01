import { URL } from "../services/URL";

type BiasMap = {
  [key: string]: { score: number; label: string };
};
export type BiasType = {
  domain: string;
  judgement: string;
  label: string;
  score: number;
};

type RobotViewerSummary = {
  sample_size: string;
  trial: string;
  design: string;
  random: BiasType;
  blind: BiasType;
};
const BIAS_MAP: BiasMap = {
  "high/unclear": { score: 1, label: "+" },
  low: { score: 0, label: "?" },
};

export class ServiceReport {
  parse(response: any): Array<RobotViewerSummary> {
    const summary: Array<RobotViewerSummary> = [];
    response.article_data.forEach((study: any) => {
      const sample_size = study.ml.sample_size;
      const author = study.grobid.authors[0];
      const trial = `${author.lastname} ${author.initials}, ${
        study.grobid.year || study.pubmed.year
      }`;
      const design = study.ml.rct.is_rct ? "RCT" : "-";
      const random = {
        domain: study.ml.bias[0].domain,
        judgement: study.ml.bias[0].judgement,
        label: BIAS_MAP[study.ml.bias[0].judgement].label,
        score: BIAS_MAP[study.ml.bias[0].judgement].score,
      };
      const blind = {
        domain: study.ml.bias[3].domain,
        judgement: study.ml.bias[3].judgement,
        label: BIAS_MAP[study.ml.bias[3].judgement].label,
        score: BIAS_MAP[study.ml.bias[3].judgement].score,
      };

      const response = {
        sample_size,
        trial,
        design,
        random,
        blind,
      };
      summary.push(response);
    });
    return summary;
  }

  async getReport(reportId: string) {
    const url = `${URL}:3000/api/download_report/${reportId}/json`;
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson;
  }

  async getBiasTable(reportId: string) {
    const response = await this.getReport(reportId);
    return this.parse(response);
  }

  async getReviewsList() {
    const url = `${URL}:5000/reviews`;
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson;
  }

  async createSystematicReview(uuid: any, file: any) {
    const url = `${URL}:5000/systematic_review`;
    const post = new FormData();
    post.append("uid", uuid);
    post.append("file", file[0]);

    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      body: post,
    });
    return response.json();
  }

  async createComparatorsForSystematicReview(uuid: any, comparators: any) {
    const url = `${URL}:5000/comparators`;
    // comparators.forEach(async (item: any) => {
    for (let item of comparators) {
      const post = new FormData();
      post.append("uid", uuid);
      post.append("outcome", item.outcome);
      post.append("intervention", item.intervention);
      post.append("comparator", item.comparator);
      item.files.forEach((file: any) => {
        post.append("files", file);
      });
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: post,
      });
    }
  }

  async getReviewResult(uid: any) {
    const url = `${URL}:5000/comparators-calc/${uid}`;
    return (await fetch(url)).json();
    // return new Promise((a, r) => {
    //   a({
    //     message: [
    //       {
    //         result: {
    //           amstar: {
    //             items: {
    //               item1: true,
    //               item2: true,
    //               item3: false,
    //               item4: true,
    //             },
    //             labels: {
    //               "1": "allocation_concealment",
    //               "2": "blinding_of_outcome_assessment",
    //               "3": "blinding_of_participants_and_personnel",
    //               "4": "random_sequence_generation",
    //             },
    //             result: 0,
    //           },
    //           heterogeneity: {
    //             i2: "45%",
    //             result: -1,
    //           },
    //           number_of_participants: {
    //             items: {
    //               "Borhani NO, 0": "883",
    //               "Malacco E, 0": "1882",
    //               "Palmer R, 0": "6321",
    //             },
    //             result: 9086,
    //             total: 0,
    //           },
    //           risk_of_bias: {
    //             allocation_concealment: {
    //               "Borhani NO, 0": 0,
    //               "Malacco E, 0": 1,
    //               "Palmer R, 0": 1,
    //             },
    //             blinding_of_outcome_assessment: {
    //               "Borhani NO, 0": 0,
    //               "Malacco E, 0": 1,
    //               "Palmer R, 0": 1,
    //             },
    //             blinding_of_participants_and_personnel: {
    //               "Borhani NO, 0": 0,
    //               "Malacco E, 0": 1,
    //               "Palmer R, 0": 0,
    //             },
    //             random_sequence_generation: {
    //               "Borhani NO, 0": 0,
    //               "Malacco E, 0": 0,
    //               "Palmer R, 0": 1,
    //             },
    //           },
    //         },
    //         values: [
    //           {
    //             label: "All-cause mortality",
    //             value: "All-cause mortality",
    //           },
    //           {
    //             label: "Diuretic",
    //             value: "Diuretic",
    //           },
    //           {
    //             label: "",
    //             value: "",
    //           },
    //         ],
    //       },
    //     ],
    //     status: "success",
    //   });
    // });
  }

  async saveFinalReview(uid: any, input: any) {
    const url = `${URL}:5000/save-final-review/${uid}`;
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw Error("");
    }
    return response.json() as Promise<any>;
  }

  async processData(uuid: string | undefined, state: any): Promise<any> {
    console.log("uid: ", uuid);
    if (uuid == undefined) {
      throw new Error("Uid undefined");
    }
    const urls = [
      `${URL}:5000/comparators-robot/${uuid}`,
      `${URL}:5000/comparators-robot-job/${uuid}`,
      `${URL}:5000/systematic_review/i2/${uuid}`,
      // `${URL}:5000/comparators-calc/${uuid}`,
    ];
    let idx = 1;
    urls.forEach(async (url, index) => {
      try {
        await fetch(url);
        state(idx * 33);
        idx++;
      } catch (e) {
        state(-1);
      }
    });
  }
}
