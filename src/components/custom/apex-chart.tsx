'use client'
import { Card } from '@/components/ui/card';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ApexChartProps {
    labels: any,
    values: any,
    title: string,
    lineColor: string;
    colors: string[];
    type: any;
    height: any;
    useCard?: boolean;
    stacked?: boolean;
    horizontal?: boolean;
    borderRadius: any;
    distributed?: boolean;
    isFunnel?: boolean;
    show?: boolean;
    enabledLabel?: boolean;
    sparkline?: boolean;
}

const ApexChart: React.FC<ApexChartProps> = (
    {
        labels,
        values,
        lineColor,
        type,
        height,
        useCard,
        title,
        stacked = false,
        horizontal = false,
        borderRadius,
        distributed = false,
        isFunnel = false,
        show = false,
        enabledLabel = false,
        colors,
        sparkline = false
    }) => {

    let data: any;

    if (type == "line") {
        data = {
            options: {

                chart: {
                    zoom: {
                        enabled: false
                    },
                    sparkline: {
                        enabled: sparkline
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: title,
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: colors, // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                toolbar: {
                    show: false,
                },
                xaxis: {
                    categories: labels,
                },
                tooltip: {
                    fixed: {
                        enabled: false
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (seriesName: any) {
                                return ''
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                },
            },

            series: values
        }
    }

    if (type == "bar") {
        data = {
            options: {
                chart: {
                    height: 350,
                    stacked: stacked,
                    sparkline: {
                        enabled: sparkline,
                    }
                },
                title: {
                    text: title,
                },
                plotOptions: {
                    bar: {
                        horizontal: horizontal,
                        barHeight: '80%',
                        distributed: distributed,
                        columnWidth: '55%',
                        borderRadius: borderRadius,
                        isFunnel: isFunnel,
                        offsetX: 0,
                        endingShape: 'rounded',
                        dataLabels: {
                            total: {
                                enabled: true,
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 900
                                }
                            }
                        }
                    },
                },
                colors: colors,
                dataLabels: {
                    enabled: enabledLabel,
                    formatter: function (val: any, opt: any) {
                        return opt.w.globals.labels[opt.dataPointIndex]
                    },
                    dropShadow: {
                        enabled: true,
                    },
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: labels,
                },
                yaxis: {
                    title: {
                        text: '$ (thousands)'
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    fixed: {
                        enabled: false
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (seriesName: any) {
                                return ''
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40,
                    show: show,
                },

            },
            series: values,
        }
    }

    if (type == "area") {
        data = {
            options: {
                chart: {
                    id: 'basic-line',
                    sparkline: {
                        enabled: sparkline,
                    },
                    toolbar : {
                        show: false
                    }
                },
                xaxis: {
                    categories: labels,
                },
                toolbar: {
                    show: false,
                },
                title: {
                    text: title,
                    align: 'left'
                },
                colors: colors,
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (seriesName: any) {
                            return ''
                        }
                    }
                },
                marker: {
                    show: false
                }
            },

            series: values
        }
    }

    if (type == "pie") {
        data = {
            options: {
                chart: {
                    width: 380,
                },
                title: {
                    text: title,
                },
                colors: colors,
                labels: labels,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            series: values
        }
    }

    if (type == "donut") {
        data = {
            options: {
                title: {
                    text: title,
                },
                colors: colors,
                labels: labels,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            series: values
        }
    }

    if (type == "radar") {
        data = {
            options: {
                labels: labels,
                chart: {
                    height: 350,
                    dropShadow: {
                        enabled: true,
                        blur: 1,
                        left: 1,
                        top: 1
                    }
                },
                title: {
                    text: title
                },
                stroke: {
                    width: 2
                },
                fill: {
                    opacity: 0.9
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    categories: labels
                },
                colors: colors,
            },
            series: values
        }
    }

    if (type == "polarArea") {
        data = {
            options: {
                labels: labels,
                stroke: {
                    colors: ['#fff']
                },
                title: {
                    text: title
                },
                fill: {
                    opacity: 0.8
                },
                colors: colors,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            series: values
        }
    }

    if (type == "radialBar") {
        data = {
            options: {
                chart: {
                    height: 390,
                },
                title: {
                    text: title
                },
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            }
                        }
                    }
                },
                colors: colors,
                labels: labels,
                legend: {
                    show: true,
                    floating: true,
                    fontSize: '13px',
                    position: 'left',
                    offsetX: 150,
                    offsetY: 25,
                    labels: {
                        useSeriesColors: true,
                    },
                    markers: {
                        size: 0
                    },
                    formatter: function (seriesName: any, opts: any) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                    itemMargin: {
                        vertical: 2
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }]
            },
            series: values
        }
    }

    if (type == "bubble") {
        data = {
            options: {
                labels: labels,
                chart: {
                    height: 350,
                },
                dataLabels: {
                    enabled: false,
                },
                title: {
                    text: title,
                },
                colors: colors,
            },
            series: values
        }
    }


    const { options, series } = data;


    return (
        <>
            {useCard && (
                <Card className="bg-transparent w-full justify-center items-center">
                    <div className='text-black'>
                        <ReactApexChart
                            className="p-3"
                            options={{
                                ...options,
                                colors: colors,
                            }}
                            series={series}
                            type={type}
                            height={height}

                        />
                    </div>
                </Card>
            )}
            {!useCard && (
                <div className='text-black items-stretch'>
                    <ReactApexChart
                        className="p-3"

                        options={{
                            ...options,
                            stroke: {
                                colors: [lineColor],
                            },
                        }}

                        series={series}
                        type={type}
                        height={height}
                    />
                </div>
            )}
        </>
    );
}

export default ApexChart;
