let option
let chart
let chartDom

const updateOptionsStyles = () => {
  const options = {
    backgroundColor: config?.chart?.background,
    title: {
      show: config?.title?.show,
      text: config?.title?.text,
      subtext: config?.subtext?.text,
      left: config?.title?.align,
      textStyle: {
        textBorderType: config?.title?.textBorderType,
        color: config?.title?.color
      },
      subtextStyle: {
        color: config?.subtext?.color
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: config?.legend?.show,
      orient: config?.legend?.orient,
      left: config?.legend?.align,
      padding: Number(config?.legend?.padding),
      itemGap: Number(config?.legend?.itemGap)
    },
    series: [
      {
        roseType: stringToBoll(config?.chart?.type),
        radius: [
          `${config?.chart?.internalRadius}%`,
          `${config?.chart?.externalRadius}%`
        ],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: config?.chart?.borderRadius,
          borderColor: config?.chart?.borderColor,
          borderWidth: config?.chart?.borderWidth
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(options)
}

const init_handler = () => {
  chartDom = document.getElementById('chart-wrapper')
  chart = echarts.init(chartDom)
  option = {
    dataset: {
      source: data
    },
    series: [
      {
        type: 'pie',
        encode: {
          value: col_rel?.values,
          itemName: col_rel?.labels
        }
      }
    ]
  }
  chart.setOption(option, {
    notMerge: true,
    lazyUpdate: true
  })
}

const transformData = async newData => {
  const [...otherData] = newData
  return otherData
}

const change_config_handler = () => {
  if (!chart) return
  updateOptionsStyles()
}

const resizeHandler = () => {
  chart?.resize({
    width: width,
    height: height
  })
}

module.exports = {
  change_config_handler,
  resizeHandler,
  init_handler,
  transformData
}
