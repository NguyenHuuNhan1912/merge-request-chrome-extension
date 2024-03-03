import { Modal, Button, Table } from "antd";
import { useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import '@/assets/css/apply.css';
import '@/assets/css/custom-antd.css';
import { MdDelete, MdLoop  } from "react-icons/md";
import { MergeRequestHistory } from "@/shares/interfaces/mrs-history.interface";
import { BASE_URL_MERGER_REQUEST } from "@/shares/constants/api.enum";
import ChildComponentProps from "@/shares/interfaces/props-modal.interface";

const MergeRequestHistoryModal: React.FC<ChildComponentProps> = ({handleSetIsShowMrHistory, mrsHistory, setMrsHistory}) => {
  
  const [dataMrsHistory, setDataMrsHistory] = useState(mrsHistory);

  const handleDeleteMrHistory = (record: MergeRequestHistory) => {
    let data = dataMrsHistory.filter(item => item.key !== record.key);
    setMrsHistory(data);
    setDataMrsHistory(data);
  }
  
  const handleAgainMrHistory = (record: MergeRequestHistory) => {
    window.open(
      `${BASE_URL_MERGER_REQUEST.BASE_URL}/${record.nameSpaceProject}/${BASE_URL_MERGER_REQUEST.getBaseUrlSrcBranch(record.projectId, record.srcBranch)}${BASE_URL_MERGER_REQUEST.getBaseUrlTargetBranch(record.projectId, record.targetBranch)}`,
      "_blank"
    );
  }

  const columns: ColumnsType<MergeRequestHistory> = [
    {
      title: 'Project name',
      width: 100,
      dataIndex: 'projectName',
      key: 'pn',
    },
    {
      title: 'Source branch',
      width: 100,
      dataIndex: 'srcBranch',
      key: 'sb',
    },
    {
      title: 'Target branch',
      dataIndex: 'targetBranch',
      key: 'tb',
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 40,
      align: 'center', 
      render: (record) => {
        return (
          <div className="flex items-center justify-center">
            <MdLoop 
              className="text-main-color base-icon"
              onClick={() => handleAgainMrHistory(record)}
            />
            <MdDelete 
              className="text-[red] base-icon ml-[10px]"
              onClick={() => handleDeleteMrHistory(record)}
            />
          </div>
        )
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(true);
  
  const handleOk = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      handleSetIsShowMrHistory();
    }, 1000);
  };

  const modalFooter = [
    <Button 
      key="ok" 
      type="primary" 
      onClick={handleOk}
      className="base-button px-[20px]"
    >
      CLOSE
    </Button>,
  ];

  const CustomTitle = () => {
    return (
      <div>
        <p className="text-main-color mb-[20px]">MERGE REQUEST HISTORY</p>
      </div>
    );
  };

  return (
    <Modal 
      width="1400px"
      title={<CustomTitle/>}
      open={isModalOpen} 
      onCancel={handleOk}
      onOk={handleOk}
      footer={modalFooter}
    >
      <Table columns={columns} dataSource={dataMrsHistory} scroll={{ x: 1000, y: 400 }} pagination={{pageSize: 5}} />
    </Modal>
  )
}

export default MergeRequestHistoryModal;