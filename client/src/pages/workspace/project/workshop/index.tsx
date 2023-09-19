import useSWR from 'swr';
import { Button, Form, Select } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import PromptSetting from '@/components/ProjectSettingComps/components/PromptSetting';
import ProjectDocSetting from '@/components/ProjectSettingComps/components/ProjectDocSetting';
import Chat from '@/components/Chat';
import { useRouter } from 'next/router';
import { fetcher } from '@/utils/http';

const WorkShop = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { query } = useRouter();
  const projectId = query.id as string;
  const changeSetting = (values) => {};

  const { data, isLoading, mutate } = useSWR(
    `/project/${projectId}/detail`,
    fetcher
  );
  console.info('data', data);
  if (isLoading) return <div>loading...</div>;
  const prompt = data?.projectDetail?.prompt;
  const docs = data?.docs || [];
  return (
    <div className={styles.workShopContainer}>
      <div className={styles.chatContainer}>
        <Chat projectId={projectId} />
      </div>
      <div className={styles.setting}>
        <div className={styles.header}>
          <div className={styles.title}>应用配置</div>
          <Button
            htmlType='submit'
            type='primary'
            theme='solid'
            loading={confirmLoading}
          >
            保存
          </Button>
        </div>
        <Select defaultValue={'gpt3.5'} disabled>
          <Select.Option value='gpt3.5'>gpt3.5</Select.Option>
          <Select.Option value='gpt4'>gpt4</Select.Option>
        </Select>
        <ProjectDocSetting docs={docs} />
        <PromptSetting projectId={projectId} prompt={prompt} />
      </div>
    </div>
  );
};

export default WorkShop;
