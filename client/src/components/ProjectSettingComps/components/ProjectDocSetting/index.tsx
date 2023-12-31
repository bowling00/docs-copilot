import EditorCard from '@/components/EditorCard';
import { ProjectSettingConfig } from '../../config';
import useUserStore from '@/store/user';
import useSWR from 'swr';
import styles from './index.module.scss';
import { DocCard } from './DocCard';
import { Button } from '@douyinfe/semi-ui';
import SelectDocModal from './SelectDocModal';
import { FC, useState } from 'react';
import { fetcher } from '@/utils/http';
import { useRouter } from 'next/router';
import { updateProject } from '@/api/project';
import { ToastError, ToastSuccess } from '@/utils/common';

interface ProjectDocSettingProps {
  docs: Doc[];
}

const ProjectDocSetting: FC<ProjectDocSettingProps> = ({ docs }) => {
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docConfirmLoading, setDocConfirmLoading] = useState(false);
  const config = ProjectSettingConfig.doc;
  const { query } = useRouter();
  const { mutate } = useSWR(`/project/${query.id}/detail`, fetcher);
  const docHandleOk = (checkedList) => {
    const projectId = query.id;
    if (typeof projectId !== 'string') return;
    updateProject({ docIds: checkedList, id: projectId })
      .then(() => {
        ToastSuccess('更新成功');
        mutate();
        setDocModalVisible(false);
      })
      .catch(() => {
        ToastError('更新失败');
      });
  };
  const docHandleCancel = () => {
    setDocModalVisible(false);
  };
  const successHandle = (url) => {
    return new Promise((resolve, reject) => {});
  };

  const getFooter = () => {
    return (
      <div className={styles.projectDocSettingfooter}>
        <Button onClick={() => setDocModalVisible(true)}>选择</Button>
      </div>
    );
  };
  const getDocs = () =>
    docs.map((item) => <DocCard doc={item} key={item.id} />);

  return (
    <EditorCard
      title={config.title}
      type='customDefinition'
      description={config.description}
      tips={config.tips}
      footer={getFooter()}
    >
      <div className={styles.container}>
        {docs.length > 0 ? getDocs() : '请选择一个知识库'}
      </div>
      <SelectDocModal
        visible={docModalVisible}
        docs={docs}
        onOk={docHandleOk}
        onCancel={docHandleCancel}
        confirmLoading={docConfirmLoading}
      />
    </EditorCard>
  );
};
export default ProjectDocSetting;
