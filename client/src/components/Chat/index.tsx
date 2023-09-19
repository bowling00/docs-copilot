import { chat } from '@/api/chat';
import styles from './index.module.scss';
import { FC, useMemo, useState } from 'react';
import { Button, Input } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';
import { similaritySearchFromDocs } from '@/api/project';
import { MessageRole } from '@/types';

interface ChatProps {
  projectId: string;
}

const Chat: FC<ChatProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<Partial<Message>[]>([
    {
      content: '你好,我是 docs-copilot 小助手',
    },
  ]);
  const [content, setContent] = useState('');
  const size = 2;

  const getMessageList = useMemo(() => {
    return chatList
      .filter((item) => item.role !== MessageRole.system)
      .map((message) => {
        return (
          <div className={styles.message} key={message.createdAt}>
            <div className={styles.messageContent}>
              {message.role && `${message.role} :`} {message.content}
            </div>
            <div className={styles.messageTime}>{message.createdAt}</div>
          </div>
        );
      });
  }, [chatList.length]);

  const sendMessage = async () => {
    setLoading(true);
    // prompt
    const humanContent = `${content}`;
    const humanMessage = {
      content: humanContent,
      role: MessageRole.human,
    };
    const contexts = await searchVectorFromDocsFunc();
    const systemMessages = contexts.map((context) => {
      return {
        content: context.pageContent,
        role: MessageRole.system,
      };
    });
    const messages = [...chatList.slice(1), ...systemMessages, humanMessage];
    chat({ messages, projectId })
      .then((res) => {
        const result = {
          content: res.data,
          role: MessageRole.ai,
        };
        const svaeMessages = [
          ...chatList.slice(1),
          ...systemMessages,
          { content: content, role: MessageRole.human },
        ];
        setChatList([...chatList, ...svaeMessages, result]);
      })
      .finally(() => {
        setContent('');
        setLoading(false);
      });
  };

  const searchVectorFromDocsFunc = (): Promise<
    similaritySearchResponseItem[]
  > => {
    return new Promise((resolve, reject) => {
      similaritySearchFromDocs({ content, projectId, size })
        .then((res) => {
          resolve(res.data);
        })
        .catch(() => {
          resolve([]);
        });
    });
  };

  return (
    <div className={styles.chatComponent}>
      <div className={styles.messageList}>{getMessageList}</div>
      <div className={styles.sendContainer}>
        <Input showClear value={content} onChange={setContent}></Input>
        <Button
          icon={<IconSend />}
          theme='solid'
          style={{ marginRight: 10 }}
          onClick={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Chat;
