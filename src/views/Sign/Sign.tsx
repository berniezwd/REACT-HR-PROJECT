import { useState, useEffect } from 'react'
import './Sign.less'
import { Descriptions, Button, Tag, Calendar, Row, Space, Select, message } from 'antd'
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import type { Dayjs } from 'dayjs'
import { useAppDispatch } from '../../store'
import _ from 'lodash'
import { getTimeAction, putTimeAction, updateInfos } from '../../store/modules/sign'
import { toZero } from '../../utils/common'
import { useRouter, useSelect } from '../../hooks'

const date = new Date()

enum DetailKey {
  normal = '正常出勤',
  absent = '旷工',
  miss = '漏打卡',
  late = '迟到',
  early = '早退',
  lateAndEarly = '迟到并早退',
}

const originDetailValue: Record<keyof typeof DetailKey, number> = {
  normal: 0,
  absent: 0,
  miss: 0,
  late: 0,
  early: 0,
  lateAndEarly: 0,
}

const originDetailState = {
  type: '' as 'success' | 'error',
  text: '' as '正常' | '异常',
}

export default function Sign() {
  const [month, setMonth] = useState(date.getMonth())
  const [detailValue, setDetailValue] = useState({ ...originDetailValue })
  const [detailState, setDetailState] = useState({ ...originDetailState })
  const { router } = useRouter()
  const signsInfos = useSelect('signInfos')
  const usersInfos = useSelect('user')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (_.isEmpty(signsInfos)) {
      dispatch(getTimeAction({ userid: usersInfos._id as string })).then((action) => {
        const { errcode, infos } = action.payload as Login.IndexSign
        if (errcode === 0) {
          dispatch(updateInfos(infos))
        }
      })
    }
  }, [signsInfos, usersInfos, dispatch])
  useEffect(() => {
    if (signsInfos.detail) {
      const detailMonth = (signsInfos.detail as { [index: string]: unknown })[toZero(month + 1)] as {
        [index: string]: unknown
      }
      for (let attr in detailMonth) {
        switch (detailMonth[attr]) {
          case DetailKey.normal:
            originDetailValue.normal++
            break
          case DetailKey.absent:
            originDetailValue.absent++
            break
          case DetailKey.miss:
            originDetailValue.miss++
            break
          case DetailKey.late:
            originDetailValue.late++
            break
          case DetailKey.early:
            originDetailValue.early++
            break
          case DetailKey.lateAndEarly:
            originDetailValue.lateAndEarly++
            break
        }
      }
      setDetailValue({ ...originDetailValue })

      for (const attr in originDetailValue) {
        if (attr !== 'normal' && originDetailValue[attr as keyof typeof originDetailValue] !== 0) {
          setDetailState({
            type: 'error',
            text: '异常',
          })
        }
      }
    }
    return () => {
      //更新前触发或销毁的时候
      setDetailState({
        type: 'success',
        text: '正常',
      })
      for (let attr in originDetailValue) {
        originDetailValue[attr as keyof typeof originDetailValue] = 0
      }
    }
  }, [month, signsInfos])

  const handlePutTime = () => {
    dispatch(putTimeAction({ userid: usersInfos._id as string })).then((action) => {
      const { errcode, infos } = action.payload as Login.IndexSign
      if (errcode === 0) {
        dispatch(updateInfos(infos))
        message.success('签到成功')
      }
    })
  }
  const handleToException = () => {
    router(`/exception?month=${month + 1}`)
  }
  const cellRender = (value: Dayjs) => {
    const month = signsInfos.time && (signsInfos.time as { [index: string]: unknown })[toZero(value.month() + 1)]
    const date = month && (month as { [index: string]: unknown })[toZero(value.date())]
    let ret = ''
    if (Array.isArray(date)) {
      ret = date.join(' - ')
    }
    return <div className="show-time">{ret}</div>
  }
  return (
    <div>
      <Descriptions className="mgb20" layout="vertical" column={9} bordered>
        <Descriptions.Item label="月份">{month + 1}月</Descriptions.Item>
        {Object.entries(DetailKey).map((v) => (
          <Descriptions.Item key={v[0]} label={v[1]}>
            {detailValue[v[0] as keyof typeof DetailKey]}
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="操作">
          <Button type="primary" onClick={handleToException} ghost size="small">
            查看详情
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="考勤状态">
          <Tag color={detailState.type}>{detailState.text}</Tag>
        </Descriptions.Item>
      </Descriptions>
      <Calendar
        cellRender={cellRender}
        locale={locale}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const monthOptions = []
          for (let i = 0; i < 12; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i}>
                {i + 1}月
              </Select.Option>,
            )
          }
          return (
            <Row justify="space-between" align="middle" className="mgb20">
              <Space>
                <Button>{value.year()}年</Button>
                <Select
                  value={month}
                  onChange={(newMonth) => {
                    setMonth(newMonth)
                    onChange(value.clone().month(newMonth))
                  }}>
                  {monthOptions}
                </Select>
              </Space>
              <Button type="primary" onClick={handlePutTime}>
                在线签到
              </Button>
            </Row>
          )
        }}
      />
    </div>
  )
}
