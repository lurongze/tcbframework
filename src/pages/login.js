import React, { useState } from 'react';
import { Form, Card, message, Button, Input, notification } from 'antd';
import { history } from 'umi';
import cloudFunc from '@/utils/cloudFunc';
import styles from './index.less';

function Login() {
  const [type, setType] = useState('login');
  const [loading, setLoading] = useState(false);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  function onLogin(values) {
    setLoading(true);
    cloudFunc.signInWithEmailAndPassword(
      values.email,
      values.password,
      () => {
        message.success('登录成功！');
        setLoading(false);
        history.push('/');
      },
      () => {
        notification.error({
          message: '登录失败！',
          description: (
            <>
              <div>1.确认邮箱是否已注册。</div>
              <div>2.邮箱或密码错误。</div>
            </>
          ),
        });
        setLoading(false);
      },
    );
  }

  function onRegister(values) {
    setLoading(true);
    cloudFunc.signUpWithEmailAndPassword(
      values.email,
      values.password,
      () => {
        message.success('验证邮件发送成功！');
        setType('login');
        setLoading(false);
      },
      () => {
        notification.error({
          message: '验证邮件发送失败！',
          description: (
            <>
              <div>1.确认邮箱是否填写正确。</div>
              <div>2.邮箱可能已经被注册。</div>
            </>
          ),
        });
        setLoading(false);
      },
    );
  }

  function onResetPassword(values) {
    setLoading(true);
    cloudFunc.sendPasswordResetEmail(
      values.email,
      () => {
        message.success('重置密码邮件发送成功！');
        setType('login');
        setLoading(false);
      },
      () => {
        notification.error({
          message: '重置密码邮件发送失败！',
          description: (
            <>
              <div>1.确认邮箱是否填写正确。</div>
            </>
          ),
        });
        setLoading(false);
      },
    );
  }

  return (
    <div className={styles.loginForm}>
      <Card
        title="欢迎登录Adroit笔记"
        extra={<a onClick={() => setType('register')}>注册</a>}
        style={{
          width: 500,
          display: `${type === 'login' ? 'block' : 'none'}`,
        }}
      >
        <Form
          {...layout}
          name="loginForm"
          initialValues={{
            remember: true,
            email: '',
            password: '',
          }}
          onFinish={onLogin}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, type: 'email', message: '请输入邮箱！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                max: 20,
                message: '请输入6-20位密码！',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item> */}

          <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
            <div className={styles.loginButton}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                style={{ width: '60%' }}
              >
                登陆
              </Button>
              <a
                onClick={() => setType('onResetPassword')}
                className={styles.forgetPassword}
              >
                忘记密码
              </a>
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="欢迎使用Adroit笔记-重置密码"
        extra={<a onClick={() => setType('login')}>登录</a>}
        style={{
          width: 500,
          display: `${type === 'onResetPassword' ? 'block' : 'none'}`,
        }}
      >
        <Form
          {...layout}
          name="resetPasswordForm"
          initialValues={{
            remember: true,
            email: '',
          }}
          onFinish={onResetPassword}
        >
          <Form.Item
            label="注册邮箱"
            name="email"
            rules={[
              { required: true, type: 'email', message: '请输入注册邮箱！' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
            <div className={styles.loginButton}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                style={{ width: '60%' }}
              >
                发送重置密码邮件
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="欢迎注册Adroit笔记"
        extra={<a onClick={() => setType('login')}>登录</a>}
        style={{
          width: 500,
          display: `${type === 'register' ? 'block' : 'none'}`,
        }}
      >
        <Form
          {...layout}
          name="registerForm"
          initialValues={{
            remember: true,
            email: '',
            confirmPassword: '',
            password: '',
          }}
          onFinish={onRegister}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入邮箱！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                max: 20,
                message: '请输入6-20位密码！',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                min: 6,
                max: 20,
                message: '请输入6-20位确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请确认两次输入密码是否相同！');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
            <div className={styles.loginButton}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                style={{ width: '60%' }}
              >
                发送注册邮件
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
