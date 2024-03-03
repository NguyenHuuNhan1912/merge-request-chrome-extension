import { Select, Button, Checkbox } from "antd";
import { FaHistory } from "react-icons/fa";
import { useEffect, useState } from "react";
import gitlabApi from "@/api/modules/gitlab.api";
import { BASE_URL_MERGER_REQUEST } from "@/shares/constants/api.enum";
import { Branch } from "@/shares/interfaces/branch.interface";
import { Project } from "@/shares/interfaces/project.interface";
import '@/assets/css/apply.css';
import '@/assets/css/custom-antd.css';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useLocalStorage } from "react-use";
import { MergeRequestHistory } from "@/shares/interfaces/mrs-history.interface";
import MergeRequestHistoryModal from "@/components/merge-request-history-modal/MergeRequestHistoryModal";
import { v4 as uuidv4 } from 'uuid';

const MergeRequest = () => {
  let [srcBranchs, setSrcBranchs] = useState<Array<Branch>>([]);
  let [targetBranchs, setTargetBranchs] = useState<Array<Branch>>([]);
  let [srcBranch, setSrcBranch] = useState("");
  let [targetBranch, setTargetBranch] = useState("");
  let [projects, setProjects] = useState<Array<Project>>([]);
  let [projectId, setProjectId] = useState(0);
  let [nameSpaceProject, setNameSpaceProject] = useState<string | undefined>("");
  let [loadingSearchTargetBranch, setLoadingSearchTargetBranch] = useState(false);
  let [loadingSearchSrcBranch, setLoadingSearchSrcBranch] = useState(false);
  let [loadingSearchProject, setLoadingSearchProject] = useState(false);
  let [checkedMrHistory, setCheckedMrHistory] = useState(true);
  let [mrsHistory, setMrsHistory] = useLocalStorage<Array<MergeRequestHistory>>('mrsHistory', []);
  let [isShowModalMrHistory, setIsShowModalMrHistory] = useState(false);
  let saveNewMr = mrsHistory?.[0];

  const onChange = (e: CheckboxChangeEvent) => {
    setCheckedMrHistory(e.target.checked);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChangeSrcBranch = (value: string) => {
    setSrcBranch(value);
  };

  const onChangeTargetBranch = (value: string) => {
    setTargetBranch(value);
  };

  const onSearchSrcBranch = (value: string) => {
    setLoadingSearchSrcBranch(true);
    getBranchsApi(value, true, false);
  };

  const onSearchTargetBranch = (value: string) => {
    setLoadingSearchTargetBranch(true);
    getBranchsApi(value, false, true);
  };

  const onChangeProject = (id: any) => {
    setNameSpaceProject(findNameSpaceInProjects(id));
    setProjectId(id);
  };

  const onSearchProject = (projectName: string) => {
    setLoadingSearchProject(true);
    getProjectsApi(projectName);
  };

  const findNameSpaceInProjects = (id: number) => {
    return projects.find(item => item.id === id)?.pathWithNamespace;
  };

  const convertBranchsResponse = (response: any) => {
    return response.map((item: any) => {
      return {
        value: item.name,
        label: item.name,
      };
    });
  };

  const convertProjectResponse = (response: any) => {
    return response.map((item: any) => {
      return {
        id: item.id,
        pathWithNamespace: item.path_with_namespace,
        value: item.id,
        label: item.name,
      };
    });
  };

  const checkExistMrHistory = () => {
    return  mrsHistory?.some(item => item.srcBranch === srcBranch && item.targetBranch === targetBranch);
  }

  const saveMrHistory = () => {
    let mrRequestHistory: MergeRequestHistory = {
      key: uuidv4(),
      projectId: projectId,
      projectName: projects.find((item: Project) => item.id === projectId)?.label ?? '',
      nameSpaceProject: nameSpaceProject ?? '',
      srcBranch: srcBranch,
      targetBranch: targetBranch
    }

    if(mrsHistory) {
      if(!checkExistMrHistory()) {
        const copiedArray = [mrRequestHistory,...mrsHistory];
        setMrsHistory(copiedArray);
      }
    }
  }

  const handleMergeRequest = () => {
    if(checkedMrHistory) saveMrHistory();
    window.open(
      `${BASE_URL_MERGER_REQUEST.BASE_URL}/${nameSpaceProject}/${BASE_URL_MERGER_REQUEST.getBaseUrlSrcBranch(projectId, srcBranch)}${BASE_URL_MERGER_REQUEST.getBaseUrlTargetBranch(projectId, targetBranch)}`,
      "_blank"
    );
  };

  const getProjectsApi = async (projectName: string) => {
    try {
      const response = await gitlabApi.getProjects({ search: projectName, membership: true});
      setProjects(convertProjectResponse(response));
      setLoadingSearchProject(false);
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  const getBranchsApi = async ( branchItem: string, srcBranch = false, targetBranch = false) => {
    try {
      const response = await gitlabApi.getBranchs(projectId, {
        search: branchItem,
      });
      if (srcBranch) {
        setSrcBranchs(convertBranchsResponse(response));
        setLoadingSearchSrcBranch(false);
      } 
      if (targetBranch) {
        setTargetBranchs(convertBranchsResponse(response));
        setLoadingSearchTargetBranch(false);
      } 
    } 
    catch (err) {
      console.log("Error: ", err);
    }
  }

  const handleSetIsShowMrHistory = () => {
    setIsShowModalMrHistory(!isShowModalMrHistory);
  }

  useEffect(() => {
    getProjectsApi("");
    if(saveNewMr) {
      setProjectId(saveNewMr.projectId);
      setSrcBranch(saveNewMr.srcBranch);
      setTargetBranch(saveNewMr.targetBranch);
      setNameSpaceProject(saveNewMr.nameSpaceProject);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      getBranchsApi("", true, true);
    }
  }, [projectId]);

  return (
    <main className="flex flex-col p-[20px] rounded-[5px] border border-[grey]">
        <div className="mb-[20px] flex items-center justify-between">
            <p className="base-button hover:text-white hover:bg-main-color">Extension</p>
            <h1 className=" ml-[60px] text-center text-mainbg-main-color text-[18px] uppercase text-main-color">
                create merge request quickly
            </h1>
        </div>
    
            <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                className="mb-[20px] w-full"
                showSearch
                placeholder="Select a project"
                optionFilterProp="children"
                defaultValue={saveNewMr?.projectName}
                onChange={onChangeProject}
                onSearch={onSearchProject}
                filterOption={filterOption}
                options={projects}
                loading={loadingSearchProject ? true : false}
            />
        
        <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            showSearch
            placeholder="Select source branch"
            optionFilterProp="children"
            defaultValue={saveNewMr?.srcBranch}
            onChange={onChangeSrcBranch}
            onSearch={onSearchSrcBranch}
            filterOption={filterOption}
            options={srcBranchs}
            disabled={projectId ? false : true}
            loading={loadingSearchSrcBranch ? true : false}
        />
        <Select
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            className="my-[20px]"
            showSearch
            placeholder="Select target branch"
            optionFilterProp="children"
            defaultValue={saveNewMr?.targetBranch}
            onChange={onChangeTargetBranch}
            onSearch={onSearchTargetBranch}
            filterOption={filterOption}
            options={targetBranchs}
            disabled={projectId ? false : true}
            loading={loadingSearchTargetBranch ? true : false}
        />

      <div className="mb-[20px] flex items-center justify-between">
        <Checkbox 
          checked={checkedMrHistory} 
          disabled={srcBranch && targetBranch ? false : true}
          onChange={onChange} 
          className="text-gray-600"
        >
          Save merge request history
        </Checkbox>
        <FaHistory 
          className="text-main-color base-icon"
          onClick={handleSetIsShowMrHistory}
        />
      </div>
      {
        isShowModalMrHistory ? 
        <MergeRequestHistoryModal 
          handleSetIsShowMrHistory={handleSetIsShowMrHistory}
          mrsHistory={mrsHistory ?? []}
          setMrsHistory={setMrsHistory}
        /> 
        : <></>
      }
      <Button
        type="primary"
        className="base-button"
        onClick={handleMergeRequest}
        disabled={srcBranch && targetBranch ? false : true}
      >
        Merge request
      </Button>
    </main>

  );
};

export default MergeRequest;
