import React from 'react';
import { Card } from 'antd-mobile';
import styles from './StepFlow.less';
import { IFlowStep } from '../Detail/services/detail';
import classNames from 'classnames';

interface IPropsData {
  data: IFlowStep[];
  type: string;
}

export default (props: IPropsData) => {
  const { data, type } = props;
  const StepContent = (step: IFlowStep, index: number) => {
    let classes
    if (type === 'initial') {
      classes = classNames({
        [styles.stepsItem]: true,
        [styles.stepWait]: true,
        [styles.stepFinish]: index === data.length - 1,
      })
    } else {
      classes = classNames({
        [styles.stepsItem]: true,
        [styles.stepWait]: step.apprStatus === 0,
        [styles.stepProcessing]: (step.apprStatus === 1 || step.apprStatus === 3),
        [styles.stepError]: step.apprStatus === 2,
        [styles.stepCancel]: step.apprStatus === 4,
        [styles.stepFinish]: index === data.length - 1,
      })
    }
    return (
      <div className={classes} key={index}>
        <div className={styles.stepTail}>
        </div>
        <div className={styles.stepLeft}>{step.stepName}</div>
        <div className={styles.img}>{step.stepNumber}</div>
        <div className={styles.stepRight}>{step.currentStepUserNames}</div>
      </div>
    )
  }
  return (
    <Card>
      <Card.Body>
        <div style={{marginTop: 40}}>
          {
            data?.map((item, index) => {
              return StepContent(item, index)
            })
          }
        </div>
      </Card.Body>
    </Card>
  )
}