import moment from 'moment';

interface IUnitList {
  code: number;
  desc: string;
}

export const toShow = (data: any) => {
  switch (data.baseControlType) {
    case 'text':
    case 'areatext':
    case 'number':
    case 'money':
    case 'remark':
    case 'formNumber':
    case 'currJobNumber':
    case 'currDate':
    case 'currDatetime':
    case 'title':
    case 'multiple':
    case 'remainCardNumber':
      return data.value;
    case 'outcheckTime':
    case 'vacationTime':
    case 'totalVacationTime':
    case 'totalReVacationTime':
    case 'overTimeTotal':
      return data.showValue;
    case 'files':
      const { value } = data;
      let newFileList: any[] = [];
      if (value) {
        value.split(',').map((item: string, index: number) => {
          newFileList.push({
            uid: -index,
            name: item.slice(-10),
            status: 'done',
            response: {
              obj: {
                url: item,
              },
            },
            url: item,
          });
        });
        // debugger
        return newFileList;
      } else return null;
    case 'date':
    case 'datetime':
    case 'vacationStartTime':
    case 'vacationEndTime':
    case 'overTimeStart':
    case 'overTimeEnd':
    case 'outCheckStartTime':
    case 'outCheckEndTime':
      return new Date(data.value);
    case 'select':
      return [data.value];

    case 'business':
    case 'position':
    case 'job':
    case 'positionLevel':
    case 'business2':
    case 'cost':
    case 'labor':
    case 'positionMLevel':
    case 'wkTask':
    case 'LevelTemplate':
    case 'LevelMTemplate':
    case 'vacationType':
    case 'addSignType':
      return [data.value + '---' + data.showValue];

    case 'user':
      return null;

    case 'depGroup':
    case 'group':
      if (data.value) {
        const newValue = data.value.split(',');
        const newShowValue = data.showValue.split(',');
        let valueArray: any[] = [];
        for (let i = 0; i < newValue.length; i++) {
          valueArray.push(newValue[i] + '---' + newShowValue[i]);
        }
        return valueArray;
      } else return null;

    case 'currUser':
    case 'currBusiness':
    case 'currBusiness2':
    case 'currDepGroup':
    case 'currGroup':
      return data.showValue;
  }
};

export const toFormData = (
  dataKey: any,
  dataValue: any,
  idName: string,
  unitList?: IUnitList[],
) => {
  let id = dataKey.split('-$-')[0];
  let baseControlType = dataKey.split('-$-')[1];
  let defaultValue = dataKey.split('-$-')[2];
  let defaultShowValue = dataKey.split('-$-')[3];
  let multipleNumber = 1;
  if (dataValue) {
    switch (baseControlType) {
      case 'text':
      case 'areatext':
      case 'number':
      case 'money':
      case 'remark':
      case 'formNumber':
      case 'title':
      case 'currDate':
      case 'currDatetime':
      case 'currJobNumber':
      case 'remainCardNumber':
        return {
          [idName]: id,
          multipleNumber,
          value: dataValue.replace('.', ''),
        };
      case 'totalVacationTime':
      case 'totalReVacationTime':
      case 'overTimeTotal':
      case 'outCheckTime':
      case 'vacationTime':
        // 设置单位
        let unitType: any = null;
        let unitValue = dataValue || '';
        let unitShowValue = dataValue || '';
        unitList?.map(unitItem => {
          if (unitShowValue?.indexOf(unitItem.desc) > -1) {
            unitType = unitItem.code;
          }
        });
        unitValue = unitValue?.replace('小时', '')?.replace('天', '');
        return {
          [idName]: id,
          multipleNumber,
          unitType,
          value: unitValue,
          showValue: unitShowValue,
        };
      case 'multiple':
        return {
          [idName]: id,
          multipleNumber,
          value: dataValue,
          showValue: dataValue,
        };
      case 'files':
        if (dataValue) {
          let { fileList } = dataValue;
          let files: any[] = [];
          fileList?.map((item: any) => {
            files.push({
              resFormControlId: id,
              fileUrl: item?.response?.obj?.url,
              fileName: item.name,
              fileSize: item.size,
              fileExtname: item.type,
              multipleNumber: 1,
            });
          });
          return {
            [idName]: id,
            type: 'files',
            multipleNumber,
            value: files,
            showValue: '',
          };
        } else
          return {
            [idName]: id,
            multipleNumber,
            value: '',
            showValue: '',
          };
      case 'date':
        return {
          [idName]: id,
          multipleNumber,
          value: moment(dataValue).format('YYYY-MM-DD'),
          showValue: moment(dataValue).format('YYYY-MM-DD'),
        };
      case 'datetime':
      case 'vacationStartTime':
      case 'vacationEndTime':
      case 'overTimeStart':
      case 'overTimeEnd':
      case 'outCheckStartTime':
      case 'outCheckEndTime':
        return {
          [idName]: id,
          multipleNumber,
          value: moment(dataValue).format('YYYY-MM-DD HH:mm'),
          showValue: moment(dataValue).format('YYYY-MM-DD HH:mm'),
        };
      case 'select':
        return {
          [idName]: id,
          multipleNumber,
          value: dataValue[0],
          showValue: dataValue[0],
        };
      case 'business':
      case 'position':
      case 'job':
      case 'positionLevel':
      case 'business2':
      case 'cost':
      case 'labor':
      case 'positionMLevel':
      case 'wkTask':
      case 'LevelTemplate':
      case 'LevelMTemplate':
      case 'vacationType':
      case 'addSignType':
        return {
          [idName]: id,
          multipleNumber,
          value: dataValue[0].split('---')[0],
          showValue: dataValue[0].split('---')[1],
        };
      case 'user':
        let newUserValue: any = [];
        let newUserShowValue: any = [];
        for (let indexValue of dataValue) {
          newUserValue.push(indexValue.split('---')[0]);
          newUserShowValue.push(indexValue.split('---')[1]);
        }
        return {
          [idName]: id,
          multipleNumber,
          value: newUserValue[newUserValue.length - 1],
          showValue: newUserShowValue[newUserShowValue.length - 1],
        };
      case 'depGroup':
      case 'group':
        let newValue: any = [];
        let newShowValue: any = [];
        for (let indexValue of dataValue) {
          newValue.push(indexValue.split('---')[0]);
          newShowValue.push(indexValue.split('---')[1]);
        }
        return {
          [idName]: id,
          multipleNumber,
          value: newValue.join(','),
          showValue: newShowValue.join(','),
        };
      case 'currUser':
      case 'currBusiness':
      case 'currBusiness2':
      case 'currDepGroup':
      case 'currGroup':
        return {
          [idName]: id,
          multipleNumber,
          value: defaultValue,
          showValue: defaultShowValue,
        };
    }
  } else {
    if (baseControlType === 'user') {
      return {
        [idName]: id,
        multipleNumber,
        value: defaultValue,
        showValue: defaultShowValue,
      };
    } else {
      return {
        [idName]: id,
        multipleNumber,
        value: '',
        showValue: '',
      };
    }
  }
};
