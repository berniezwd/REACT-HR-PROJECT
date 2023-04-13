import {
  Button,
  Row,
  Space,
  Input,
  Divider,
  Radio,
  RadioChangeEvent,
  Table,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
} from 'antd'
import './Apply.less'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Infos } from '../../store/modules/check'
import { useRTK, useSelect } from '../../hooks'
import _ from 'lodash'
import { getApplyAction, postApplyAction, putApplyAction, updateapplyList } from '../../store/modules/check'
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'

type FormInfos = {
  approvername: string
  note: string
  reason: string
  time: [string, string]
}

export default function Apply() {
  const { dispatch } = useRTK()
  const user = useSelect('infos')
  const applyList = useSelect('applyList')
  const [typeValue, setTypeValue] = useState('a')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (_.isEmpty(applyList)) {
      dispatch(
        getApplyAction({
          applicantid: user._id,
        }),
      ).then((action) => {
        const { errcode, rets } = action.payload as { errcode: number; rets: Infos[] }
        if (errcode === 0 && rets.length > 0) {
          dispatch(updateapplyList(rets))
        }
      })
    }
  }, [])

  const onSelectType = (e: RadioChangeEvent) => {
    setTypeValue(e.target.value)
  }

  const columns: ColumnsType<Infos> = [
    {
      title: '申请人',
      dataIndex: 'applicantname',
      key: 'applicantname',
    },
    {
      title: '审批事由',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render(_) {
        return _.join(' - ')
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '审批人',
      dataIndex: 'approvername',
      key: 'approvername',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },
  ]
  const onSearch = (value: string) => {
    console.log('value', value)
  }
  const handleReset = () => {
    form.resetFields()
  }
  const onFinish = (values: FormInfos) => {
    console.log('values', values)
    values.time[0] = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
    values.time[1] = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
    const applyParams = {
      ...values,
      applicantid: user._id,
      applicantname: user.name,
      approverid:
        Array.isArray(user.approver) &&
        user.approver.find((item: { _id: number; name: string }) => values.approvername === item.name)._id,
    }
    console.log('values', applyParams)
    dispatch(postApplyAction(applyParams)).then((action) => {
      const { errcode } = action.payload as Infos
      if (errcode === 0) {
        message.success(`添加审批成功`)
        setIsModalOpen(false)
        dispatch(
          getApplyAction({
            applicantid: user._id,
          }),
        ).then((action) => {
          const { errcode, rets } = action.payload as { errcode: number; rets: Infos[] }
          if (errcode === 0 && rets.length > 0) {
            dispatch(updateapplyList(rets))
          }
        })
      }
    })
  }
  const onFinishFailed = ({ values }: { values: FormInfos }) => {
    console.log('Fileds-Error', values)
  }
  return (
    <>
      <Row justify="space-between" style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          添加审批
        </Button>
        <Space>
          <Input.Search
            placeholder="请输入搜索关键词"
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={(value) => onSearch(value)}
          />
          <Divider type="vertical" style={{ borderLeftColor: '#dcdfe6' }} />
          <Radio.Group defaultValue={typeValue} buttonStyle="solid" size="middle" onChange={(e) => onSelectType(e)}>
            <Radio.Button value="a">全部</Radio.Button>
            <Radio.Button value="b">待审批</Radio.Button>
            <Radio.Button value="c">已通过</Radio.Button>
            <Radio.Button value="d">未通过</Radio.Button>
          </Radio.Group>
        </Space>
      </Row>
      <Table rowKey="_id" dataSource={applyList} columns={columns} bordered size="small" />
      <Modal title="添加审批" open={isModalOpen} footer={null}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          labelCol={{ span: 4 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          wrapperCol={{ span: 20 }}>
          <Form.Item label="审批人" name="approvername" rules={[{ required: true, message: '请选择审批人!' }]}>
            <Select placeholder="请选择审批人" allowClear>
              {Array.isArray(user.approver) &&
                user.approver.map((item: { _id: number; name: string }) => {
                  return (
                    <Select.Option key={item._id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>

          <Form.Item label="审批理由" name="reason" rules={[{ required: true, message: '请输入审批理由!' }]}>
            <Select placeholder="请选择审批理由" allowClear>
              <Select.Option value="年假">年假</Select.Option>
              <Select.Option value="事假">事假</Select.Option>
              <Select.Option value="病假">病假</Select.Option>
              <Select.Option value="外出">外出</Select.Option>
              <Select.Option value="补签卡">补签卡</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="时间" name="time" rules={[{ required: true, message: '请选择时间!' }]}>
            <DatePicker.RangePicker showTime locale={locale} style={{ width: '100%' }}></DatePicker.RangePicker>
          </Form.Item>

          <Form.Item label="备注" name="note" rules={[{ required: true, message: '请输入备注!' }]}>
            <Input.TextArea placeholder="请输入备注" rows={4} />
          </Form.Item>

          <Row justify="end">
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
