import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Accordion, AccordionDetails, AccordionSummary, Avatar, Badge, Button, CardMedia, FormControl, Grid, Hidden, IconButton, InputLabel, MenuItem, Select, Tooltip, Typography } from "@material-ui/core";
import { amber, blue, green, grey, red, orange } from '@material-ui/core/colors';

import RefreshIcon from '@material-ui/icons/Refresh';
import BuildIcon from '@material-ui/icons/Build';
import InputIcon from '@material-ui/icons/Input';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import MemoryIcon from '@material-ui/icons/Memory';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import sentry from '../../assets/sentry.svg';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import I18n from '@iobroker/adapter-react/i18n';
import ComplexCron from '@iobroker/adapter-react/Dialogs/ComplexCron';

import InstanceInfo from './InstanceInfo';
import State from '../State';
import CustomModal from '../CustomModal';

const boxShadow = '0 2px 2px 0 rgba(0, 0, 0, .14),0 3px 1px -2px rgba(0, 0, 0, .12),0 1px 5px 0 rgba(0, 0, 0, .2)';
const boxShadowHover = '0 8px 17px 0 rgba(0, 0, 0, .2),0 6px 20px 0 rgba(0, 0, 0, .19)';

const styles = theme => ({
    root: {
        position: 'relative',
        margin: 10,
        width: 300,
        minHeight: 200,
        background: theme.palette.background.default,
        boxShadow,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.5s',
        '&:hover': {
            boxShadow: boxShadowHover
        }
    },
    row: {
        paddingLeft: 8,
    },
    imageBlock: {
        background: 'silver',
        minHeight: 60,
        display: 'flex',
        padding: '0 10px 0 10px',
        position: 'relative',
        justifyContent: 'space-between',
        transition: 'background 0.5s',
    },
    img: {
        width: 45,
        height: 45,
        margin: 'auto 0',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url("img/no-image.png") 100% 100% no-repeat',
            backgroundSize: 'cover',
            backgroundColor: '#fff',
        }
    },
    installed: {
        background: '#77c7ff8c'
    },
    update: {
        background: '#10ff006b'
    },
    fab: {
        position: 'absolute',
        bottom: -20,
        width: 40,
        height: 40,
        right: 20,
    },
    greenText: {
        color: theme.palette.success.dark,
    },

    collapse: {
        height: '100%',
        backgroundColor: 'silver',
        position: 'absolute',
        width: '100%',
        zIndex: 3,
        marginTop: 'auto',
        bottom: 0,
        transition: 'height 0.3s',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column'
    },
    collapseOff: {
        height: 0
    },
    close: {
        width: '20px',
        height: '20px',
        opacity: '0.9',
        cursor: 'pointer',
        position: 'relative',
        marginLeft: 'auto',
        marginBottom: 10,
        transition: 'all 0.6s ease',
        '&:hover': {
            transform: 'rotate(90deg)'
        },
        '&:before': {
            position: 'absolute',
            left: '9px',
            content: '""',
            height: '20px',
            width: '3px',
            backgroundColor: '#ff4f4f',
            transform: 'rotate(45deg)'
        },
        '&:after': {
            position: 'absolute',
            left: '9px',
            content: '""',
            height: '20px',
            width: '3px',
            backgroundColor: '#ff4f4f',
            transform: 'rotate(-45deg)'
        },
    },
    footerBlock: {
        background: theme.palette.background.default,
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between'
    },
    hidden: {
        display: 'none'
    },
    buttonUpdate: {
        border: '1px solid',
        padding: '0px 7px',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.5s',
        '&:hover': {
            background: '#00800026'
        }
    },
    versionDate: {
        alignSelf: 'center'
    },
    adapter: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: 16,
        verticalAlign: 'middle',
        paddingLeft: 8,
        paddingTop: 16,
        color: theme.palette.type === 'dark' ? '#333' : '#555'
    },
    hide: {
        visibility: 'hidden'
    },
    button: {
        padding: 5,
        transition: 'opacity 0.2s',
        height: 34
    },
    visibility: {
        opacity: 0
    },
    enabled: {
        color: green[400],
        '&:hover': {
            backgroundColor: green[200]
        }
    },
    disabled: {
        color: red[400],
        '&:hover': {
            backgroundColor: red[200]
        }
    },
    instanceName: {
        fontSize: 16,
        paddingLeft: 32,
        paddingBottom: 5,
        fontWeight: 'bold'
    },
    cardContent: {
        marginTop: 16,
        paddingTop: 0
    },
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3)
    },
    statusIndicator: {
        marginTop: 10,
    },
    instanceIcon: {
        height: 42,
        width: 42,
    },
    table: {
        minWidth: 650,
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: grey[300],
        },
        '&:nth-of-type(even)': {
            backgroundColor: grey[200],
        }
    },
    state: {
        width: theme.spacing(2),
        height: theme.spacing(2),
        borderRadius: '100%'
    },

    green: {
        //backgroundColor: green[700]
        color: green[700]
    },
    red: {
        //backgroundColor: red[700]
        color: red[700]
    },
    grey: {
        //backgroundColor: grey[700]
        color: grey[700]
    },
    blue: {
        //backgroundColor: blue[700]
        color: '#0055a9'//blue[700]
    },
    orange: {
        //backgroundColor: orange[700]
        color: orange[400]
    },
    transparent: {
        color: 'transparent',
        backgroundColor: 'transparent'
    },
    paper: {
        height: '100%'
    },
    iframe: {
        height: '100%',
        width: '100%',
        border: 0
    },
    silly: {

    },
    debug: {
        backgroundColor: grey[700]
    },
    info: {
        backgroundColor: blue[700]
    },
    warn: {
        backgroundColor: amber[700]
    },
    error: {
        backgroundColor: red[700]
    },
    grow: {
        flexGrow: 1
    },
    tableRender: {
        tableLayout: 'fixed',
        minWidth: 960,
        '& td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    cards: {
        display: 'flex',
        flexFlow: 'wrap',
        justifyContent: 'center',
    },
    sentry: {
        width: 24,
        height: 24,
        objectFit: 'fill',
        filter: 'invert(0%) sepia(90%) saturate(1267%) hue-rotate(-260deg) brightness(99%) contrast(97%)'
    },
    hidden1250: {
        display: 'flex',
        minWidth: 200
    },
    visible1250: {
        display: 'none',
        minWidth: 200
    },
    visible1050: {
        display: 'none'
    },
    hidden1050: {
        display: 'flex'
    },
    '@media screen and (max-width: 1250px)': {
        hidden1250: {
            display: 'none !important'
        },
        visible1250: {
            display: 'flex !important'
        },
    },
    '@media screen and (max-width: 1050px)': {
        hidden1050: {
            display: 'none !important'
        },
        visible1050: {
            display: 'flex !important'
        },
    },
    displayFlex: {
        display: 'flex',
    },
    secondaryHeading: {
        maxWidth: 220,
        fontSize: 12,
    },
    secondaryHeadingDiv: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 200
    },
    secondaryHeadingDivDiv: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        padding: 5,
        textOverflow: 'ellipsis',
        maxWidth: 200
    },
    /*summaryText: {
        display: 'flex',
        minWidth: 200,
        justifyContent: 'space-around'
    },
    summaryInstanceId: {
        minWidth: 100,
        marginLeft: 5,
        alignSelf: 'center'
    },*/
    formControl: {
        width: '100%',
        marginBottom: 5
    },
    formControl2: {
        marginBottom: 5,
        marginTop: 5,
        width: 120
    },
    gridStyle: {
        display: 'flex',
        minWidth: 270,
        lineHeight: '42px',
        justifyContent: 'space-around'
    },
    wrapperAvatar: {
        maxWidth: 130
    },
    instanceId: {
        overflow: 'hidden',
        alignSelf: 'center',
        fontSize: 16,
        marginLeft: 5,
        maxWidth: 150,
        minWidth: 100,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        flexGrow: 2,
    },
    marginLeft: {
        marginLeft: 5
    },
    marginRight: {
        marginRight: 5
    },
    selectStyle: {
        display: 'flex',
        margin: 5,
        justifyContent: 'space-around'
    },
    selectWrapper: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    scheduleIcon: {
        color: '#dc8e00'
    },
    ram: {
        color: '#dc8e00'
    },
    contrast0: {
        filter: 'contrast(0%)'
    },
    paddingRight200: {
        paddingRight: 200
    },
    instanceStateNotAlive1: {
        backgroundColor: 'rgba(192, 192, 192, 0.2)'
    },
    instanceStateNotAlive2: {
        backgroundColor: 'rgba(192, 192, 192, 0.15)'
    },
    instanceStateAliveNotConnected1: {
        backgroundColor: 'rgba(255, 177, 0, 0.1)'
    },
    instanceStateAliveNotConnected2: {
        backgroundColor: 'rgba(255, 177, 0, 0.15)'
    },
    instanceStateAliveAndConnected1: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)'
    },
    instanceStateAliveAndConnected2: {
        backgroundColor: 'rgba(0, 255, 0, 0.15)'
    }
});
const InstanceRow = ({
    name,
    classes,
    expertMode,
    instance,
    running,
    id,
    extendObject,
    openConfig,
    connectedToHost,
    alive,
    connected,
    getMemory,
    loglevelIcon,
    getRestartSchedule,
    getSchedule,
    key,
    checkCompact,
    compactGroup,
    setCompactGroup,
    compactGroupCount,
    setCompact,
    compact,
    supportCompact,
    getInstanceState,
    getModeIcon,
    expanded,
    handleChange,
    checkSentry,
    currentSentry,
    setSentry,
    setRestartSchedule,
    setName,
    logLevel,
    setLogLevel,
    inputOutput,
    mode,
    setSchedule,
    deletedInstances,
    memoryLimitMB,
    setMemoryLimitMB,
    t,
    idx
}) => {
    const [openSelect, setOpenSelect] = useState(false);
    const [openDialogCron, setOpenDialogCron] = useState(false);
    const [openDialogSchedule, setOpenDialogSchedule] = useState(false);
    const [openDialogText, setOpenDialogText] = useState(false);
    const [openDialogSelect, setOpenDialogSelect] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogMemoryLimit, setOpenDialogMemoryLimit] = useState(false);
    const [select, setSelect] = useState(logLevel);

    const arrayLogLevel = ['silly', 'debug', 'info', 'warn', 'error'];

    const customModal =
        openDialogSelect ||
        openDialogText   ||
        openDialogDelete ||
        openDialogMemoryLimit ? <CustomModal
            title={
                (openDialogText && t('Enter title for %s', instance.id)) ||
                (openDialogSelect && t('Edit log level rule for %s', instance.id)) ||
                (openDialogDelete && t('Please confirm')) ||
                (openDialogMemoryLimit && t('Edit memory limit rule for %s', instance.id))
            }
            help={openDialogMemoryLimit && t('Default V8 has a memory limit of 512mb on 32-bit systems, and 1gb on 64-bit systems. The limit can be raised by setting --max-old-space-size to a maximum of ~1gb (32-bit) and ~1.7gb (64-bit)')}
            open={true}
            applyDisabled={openDialogText || openDialogMemoryLimit}
            textInput={openDialogText || openDialogMemoryLimit}
            defaultValue={openDialogText ? name : openDialogMemoryLimit ? memoryLimitMB : ''}
            onApply={value => {
                if (openDialogSelect) {
                    setLogLevel(select)
                    setOpenDialogSelect(false);
                } else if (openDialogText) {
                    setName(value);
                    setOpenDialogText(false);
                } else if (openDialogDelete) {
                    setOpenDialogDelete(false);
                    deletedInstances();
                } else if (openDialogMemoryLimit) {
                    setMemoryLimitMB(value)
                    setOpenDialogMemoryLimit(false);
                }
            }}
            onClose={() => {
                if (openDialogSelect) {
                    setSelect(logLevel);
                    setOpenDialogSelect(false);
                } else if (openDialogText) {
                    setOpenDialogText(false);
                } else if (openDialogDelete) {
                    setOpenDialogDelete(false);
                } else if (openDialogMemoryLimit) {
                    setOpenDialogMemoryLimit(false);
                }
            }}>
            {openDialogSelect && <FormControl className={classes.formControl} variant="outlined" >
                <InputLabel htmlFor="outlined-age-native-simple">{t('log level')}</InputLabel>
                <Select
                    variant="standard"
                    value={select}
                    fullWidth
                    onChange={el => setSelect(el.target.value)}
                >
                    {arrayLogLevel.map(el => <MenuItem key={el} value={el}>
                        {t(el)}
                    </MenuItem>)}
                </Select>
            </FormControl>}
            {openDialogDelete && t('Are you sure you want to delete the instance %s?', instance.id)}
        </CustomModal> : null;

    const [visibleEdit, handlerEdit] = useState(false);

    const state = getInstanceState(id);

    return <Accordion key={key} square
        expanded={expanded === instance.id}
        onChange={() => {
            if (openDialogCron     ||
                openDialogSchedule ||
                openDialogSelect   ||
                openDialogText     ||
                openDialogDelete   ||
                openDialogMemoryLimit) {
                return;
            }
            handleChange(instance.id);
        }}>
        <AccordionSummary
            classes={{ root: classes.row }}
            className={clsx(
                (!connectedToHost || !alive) && (idx % 2 === 0 ? classes.instanceStateNotAlive1 : classes.instanceStateNotAlive2),
                connectedToHost && alive && connected === false && (idx % 2 === 0 ? classes.instanceStateAliveNotConnected1 : classes.instanceStateAliveNotConnected2),
                connectedToHost && alive && connected !== false && (idx % 2 === 0 ? classes.instanceStateAliveAndConnected1 : classes.instanceStateAliveAndConnected1)
            )}
            expandIcon={<ExpandMoreIcon />}>
            {customModal}
            {(openDialogCron || openDialogSchedule) && <ComplexCron
                title={
                    (openDialogCron     && t('Edit restart rule for %s', instance.id)) ||
                    (openDialogSchedule && t('Edit schedule rule for %s', instance.id))
                }
                cron={openDialogCron ? getRestartSchedule(id) : getSchedule(id)}
                language={I18n.getLanguage()}
                onOk={cron => {
                    if (openDialogCron) {
                        setRestartSchedule(cron);
                    } else if (openDialogSchedule) {
                        setSchedule(cron);
                    }
                }}
                onClose={() => {
                    if (openDialogCron) {
                        setOpenDialogCron(false);
                    } else if (openDialogSchedule) {
                        setOpenDialogSchedule(false);
                    }
                }}
            />}
            <Grid container spacing={1} alignItems="center" direction="row" wrap="nowrap">
                <div className={classes.gridStyle}>
                    <Avatar className={clsx(
                        classes.smallAvatar,
                        classes.statusIndicator,
                        instance.mode === 'daemon' || instance.mode === 'schedule' ? classes[state] : classes.transparent
                    )}>
                        {getModeIcon(instance.mode)}
                    </Avatar>
                    {/*<Badge color="secondary" variant="dot" invisible={!instance.compactMode}>
                        <Avatar
                            variant="square"
                            alt={instance.id}
                            src={instance.image}
                            className={classes.instanceIcon}
                        />
                    </Badge>*/}
                    <div className={classes.instanceId}>
                        {instance.id}
                    </div>
                </div>
                <IconButton
                    size="small"
                    onClick={e => {
                        e.stopPropagation();
                        extendObject('system.adapter.' + instance.id, { common: { enabled: !running } });
                    }}
                    onFocus={event => event.stopPropagation()}
                    className={clsx(classes.button, instance.canStart ?
                        (running ? classes.enabled : classes.disabled) : classes.hide)}
                >
                    {running ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Hidden xsDown>
                    <IconButton
                        size="small"
                        className={clsx(classes.button,!instance.config && classes.visibility)}
                        onClick={() => openConfig(id)}
                    >
                        <BuildIcon />
                    </IconButton>
                </Hidden>
                <IconButton
                    size="small"
                    onClick={event => {
                        extendObject('system.adapter.' + instance.id, {});
                        event.stopPropagation();
                    }}
                    onFocus={event => event.stopPropagation()}
                    className={clsx(classes.button, !instance.canStart && classes.hide)}
                    disabled={!running}
                >
                    <RefreshIcon />
                </IconButton>
                <IconButton
                    size="small"
                    className={clsx(classes.button, (!instance.link || !instance.link[0]) && classes.hide)}
                    disabled={!running}
                    onClick={event => {
                        window.open(instance.link, '_blank');
                        event.stopPropagation();
                    }}
                    onFocus={event => event.stopPropagation()}
                >
                    <InputIcon />
                </IconButton>

                <Typography className={classes.secondaryHeading} component="div">
                    <div
                    onMouseMove={() => handlerEdit(true)}
                    onMouseEnter={() => handlerEdit(true)}
                    onMouseLeave={() => handlerEdit(false)}
                    className={classes.secondaryHeadingDiv}>
                        <div className={classes.secondaryHeadingDivDiv}>{name}</div>
                        <Tooltip title={t('Edit')}>
                        <IconButton
                            size="small"
                            className={clsx(classes.button, !visibleEdit && classes.visibility)}
                            onClick={event => {
                                setOpenDialogText(true);
                                event.stopPropagation();
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        </Tooltip>
                    </div>
                </Typography>
                {expertMode &&
                    <div className={classes.hidden1250} >
                        <InstanceInfo
                            icon={<ImportExportIcon />}
                            tooltip={t('events')}
                        >
                            <div className={classes.displayFlex}>
                                <Tooltip title={t('input events')}>
                                    <div className={classes.marginRight}>⇥{inputOutput.stateInput}</div>
                                </Tooltip>
                                    /
                                <Tooltip title={t('output events')}>
                                    <div className={classes.marginLeft}>↦{inputOutput.stateOutput}</div>
                                </Tooltip>
                            </div>
                        </InstanceInfo>
                    </div>
                }
                {expertMode &&
                    <Tooltip title={t('loglevel') + ' ' + logLevel}>
                        <Avatar className={clsx(classes.smallAvatar, classes[logLevel])}>
                        {loglevelIcon}
                    </Avatar>
                </Tooltip>
                }
                <Grid item className={classes.hidden1050}>
                    <InstanceInfo
                        icon={<MemoryIcon />}
                        tooltip={t('RAM usage')}
                    >
                        {(instance.mode === 'daemon' && running ? getMemory(id) : '-.--') + ' MB'}
                    </InstanceInfo>
                </Grid>
            </Grid>
            <div className={classes.displayFlex}>
                <Tooltip title="sentry">
                    <IconButton
                        size="small"
                        className={clsx(classes.button, expertMode && checkSentry ? null : classes.hide)}
                        onClick={e => {
                            e.stopPropagation();
                            setSentry();
                        }}
                    >
                        <CardMedia
                            className={clsx(classes.sentry, !currentSentry && classes.contrast0)}
                            component="img"
                            image={sentry}
                        />
                    </IconButton>
                </Tooltip>
            </div>
            {supportCompact ? <Tooltip title={t('compact groups')}>
                <IconButton
                    size="small"
                    className={clsx(classes.button, expertMode && checkCompact ? null : classes.hide)}
                    onClick={e=> {
                        e.stopPropagation();
                        setCompact();
                    }}
                >
                    <ViewCompactIcon color={compact ? 'primary' : 'inherit'} />
                </IconButton>
            </Tooltip> : null}
            <Tooltip title={t(!running ? 'Deactivated. Click to start.' : 'Activated. Click to stop.')}>
                <IconButton
                    size="small"
                    onClick={event => {
                        extendObject('system.adapter.' + instance.id, { common: { enabled: !running } });
                        event.stopPropagation();
                    }}
                    onFocus={event => event.stopPropagation()}
                    className={clsx(classes.button, instance.canStart ?
                        (running ? classes.enabled : classes.disabled) : classes.hide)}
                >
                    {running ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
            </Tooltip>
            <Hidden xsDown>
                <Tooltip title={t('Settings')}>
                    <IconButton
                        size="small"
                        className={clsx(classes.button, !instance.config && classes.visibility)}
                        onClick={() => openConfig(id)}
                    >
                        <BuildIcon />
                    </IconButton>
                </Tooltip>
            </Hidden>
            <Tooltip title={t('Reload')}>
                <IconButton
                    size="small"
                    onClick={event => {
                        extendObject('system.adapter.' + instance.id, {});
                        event.stopPropagation();
                    }}
                    onFocus={event => event.stopPropagation()}
                    className={clsx(classes.button, !instance.canStart && classes.hide)}
                    disabled={!running}
                >
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('Open web page of adapter')}>
                <IconButton
                    size="small"
                    className={clsx(classes.button, (!instance.link || !instance.link[0]) && classes.hide)}
                    disabled={!running}
                    onClick={event => {
                        window.open(instance.link, '_blank');
                        event.stopPropagation();
                    }}
                    onFocus={event => event.stopPropagation()}
                >
                    <InputIcon />
                </IconButton>
            </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="row">
                <Grid item container direction="row" xs={10}>
                    <Grid item container direction="column" xs={12} sm={6} md={4}>
                        <span className={classes.instanceName}>{instance.id}</span>
                        {instance.mode === 'daemon' && <State state={connectedToHost} >{t('Connected to host')}</State>}
                        {instance.mode === 'daemon' && <State state={alive} >{t('Heartbeat')}</State>}
                        {connected !== null &&
                            <State state={connected}>
                                {t('Connected to %s', instance.adapter)}
                            </State>
                        }
                    </Grid>
                    <Grid container item direction="column" xs={12} sm={6} md={4}>
                        <InstanceInfo tooltip={t('Installed')}>
                            v {instance.version}
                        </InstanceInfo>
                    </Grid>
                    <Grid container item direction="column" xs={12} sm={6} md={4} className={classes.paddingRight200}>
                        {expertMode && <div className={classes.displayFlex}>
                            <InstanceInfo icon={loglevelIcon} tooltip={t('loglevel')}>
                                {logLevel}
                            </InstanceInfo>
                            <Tooltip title={t('Edit')}>
                            <IconButton
                                size="small"
                                className={classes.button}
                                onClick={(event) => {
                                    setOpenDialogSelect(true);
                                    event.stopPropagation();
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            </Tooltip>
                        </div>}
                        {expertMode &&
                            <div className={classes.visible1250}>
                                <InstanceInfo icon={<ImportExportIcon />} tooltip={t('events')}>
                                    <div className={classes.displayFlex}>
                                        <Tooltip title={t('input events')}>
                                            <div className={classes.marginRight}>⇥{inputOutput.stateInput}</div>
                                        </Tooltip>
                                    /
                                        <Tooltip title={t('output events')}>
                                            <div className={classes.marginLeft}>↦{inputOutput.stateOutput}</div>
                                        </Tooltip>
                                    </div>
                                </InstanceInfo>
                            </div>
                        }
                        <Grid item className={classes.visible1050}>
                            <InstanceInfo icon={<MemoryIcon />} tooltip={t('RAM usage')}>
                                {(instance.mode === 'daemon' && running ? getMemory(id) : '-.--') + ' MB'}
                            </InstanceInfo>
                        </Grid>
                        {mode && <div className={classes.displayFlex}>
                            <InstanceInfo icon={<ScheduleIcon />} tooltip={t('schedule_group')}>
                                {getSchedule(id) || '-'}
                            </InstanceInfo>
                            <Tooltip title={t('Edit')}>
                            <IconButton
                                size="small"
                                className={classes.button}
                                onClick={(event) => {
                                    setOpenDialogSchedule(true);
                                    event.stopPropagation();
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            </Tooltip>
                        </div>}
                        {expertMode && (instance.mode === 'daemon') &&
                            <div className={classes.displayFlex}>
                                <InstanceInfo
                                    icon={<ScheduleIcon className={classes.scheduleIcon} />}
                                    tooltip={t('restart')}
                                >
                                    {getRestartSchedule(id) || '-'}
                                </InstanceInfo>
                                <Tooltip title={t('Edit')}>
                                <IconButton
                                    size="small"
                                    className={classes.button}
                                    onClick={(event) => {
                                        setOpenDialogCron(true);
                                        event.stopPropagation();
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                </Tooltip>
                            </div>
                        }
                        {expertMode && <div className={classes.displayFlex}>
                            <InstanceInfo
                                icon={<MemoryIcon className={classes.ram} />}
                                tooltip={t('RAM limit')}
                            >
                                {(memoryLimitMB ? memoryLimitMB : '-.--') + ' MB'}
                            </InstanceInfo>
                            <Tooltip title={t('Edit')}>
                            <IconButton
                                size="small"
                                className={classes.button}
                                onClick={e => {
                                    e.stopPropagation();
                                    setOpenDialogMemoryLimit(true);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            </Tooltip>
                        </div>
                        }
                        {expertMode && checkCompact && compact && supportCompact && <div className={classes.selectWrapper}>
                            <ViewCompactIcon className={classes.marginRight} color="inherit" />
                            <FormControl className={classes.formControl2}  variant="outlined" >
                                <InputLabel htmlFor="outlined-age-native-simple">{t('compact groups')}</InputLabel>
                                <Select
                                    variant="standard"
                                    autoWidth
                                    onClose={() => setOpenSelect(false)}
                                    onOpen={() => setOpenSelect(true)}
                                    open={openSelect}
                                    value={compactGroup === 1 ? 'default' : compactGroup === '0' ? "controller" : !compactGroup ? 'default' : compactGroup || 'default'}
                                    onChange={el => setCompactGroup(el.target.value)}
                                >
                                    <div onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                        className={classes.selectStyle}>
                                        <Button onClick={() => {
                                            setOpenSelect(false);
                                            setCompactGroup(compactGroupCount + 1);
                                        }} variant="outlined" stylevariable='outlined'>{t('Add compact group')}</Button>
                                    </div>
                                    <MenuItem value="controller">
                                        {t('with controller')}
                                    </MenuItem>
                                    <MenuItem value="default">
                                        {t('default group')}
                                    </MenuItem>
                                    {Array(compactGroupCount - 1).fill().map((_, idx) => <MenuItem key={idx} value={idx + 2}>
                                        {idx + 2}
                                    </MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>}
                    </Grid>
                </Grid>
                <Grid item container direction="column" xs={2}>
                    <Grid item>
                        <Hidden smUp>
                            <Tooltip title={t('Settings')}>
                            <IconButton
                                size="small"
                                className={classes.button}
                                onClick={() => openConfig(id)}
                            >
                                <BuildIcon />
                            </IconButton>
                            </Tooltip>
                        </Hidden>
                        <Tooltip title={t('Delete')}>
                        <IconButton
                            size="small"
                            className={classes.button}
                            onClick={(event) => {
                                setOpenDialogDelete(true);
                                event.stopPropagation();
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion >;
}

InstanceRow.propTypes = {
    /**
     * Link and text
     * {link: 'https://example.com', text: 'example.com'}
     */
    t: PropTypes.func,
};


export default withStyles(styles)(InstanceRow);