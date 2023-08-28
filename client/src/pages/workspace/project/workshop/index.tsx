import { Button, Form, Select } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { useState } from 'react';
import PromptSetting from '@/components/ProjectSettingComps/components/PromptSetting';
import ProjectDocSetting from '@/components/ProjectSettingComps/components/ProjectDocSetting';

const WorkShop = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const changeSetting = (values) => {};
  return (
    <div className={styles.workShopContainer}>
      <div className={styles.chatContainer}>chat</div>
      <div className={styles.setting}>
        <>
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
          <ProjectDocSetting />
          <PromptSetting />
        </>
      </div>
    </div>
  );
};

export default WorkShop;