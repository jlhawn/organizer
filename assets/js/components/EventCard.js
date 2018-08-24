import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Icon from '@material-ui/core/Icon'
import { connect } from 'react-redux'
import _ from 'lodash'
import ColorHash from 'color-hash'
import fontColorContrast from 'font-color-contrast'
import moment from 'moment'
import { library as faLibrary } from '@fortawesome/fontawesome'
import distance from '@turf/distance'
import bearing from '@turf/bearing'
import { getCoords } from '@turf/invariant'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendar'
import faCalendarCheck from '@fortawesome/fontawesome-free-solid/faCalendarCheck'
import BaseMap from './mapping/BaseMap'
import { Marker } from 'react-leaflet'

import { getCurrentLocation } from '../selectors/geocache'
import { getCurrentUser } from '../selectors/auth'
import { Model } from '../store'

faLibrary.add(faCalendar, faCalendarCheck)

const Events = new Model('events')
const hasher = new ColorHash()
const colorForEvent = evt => hasher.hex(_.get(evt, 'uid'))

const locationDisplay = (evt, currentLocation) => {
    const validLocation = evt.geo && currentLocation
    if (validLocation) {
        return evt.location.raw + ' - ' + Math.round(distance(currentLocation, evt.geo, {units: 'miles'})) + ' miles'
    } else {
        return evt.location.raw
    }
}

export const EventCard = props => {
    const eventBearing = props.currentLocation ? bearing(props.currentLocation, props.event.geo) - 45 : 0
    const checkInButton = (<Button variant="fab" size="large" className={props.classes.checkInButton} onClick={() => props.onCheckIn(props.event)}><Icon className="fa fa-calendar" /></Button>)
    const checkedInBadge = (<Button variant="fab" size="large" className={props.classes.checkedInBadge}><Icon className="fa fa-calendar-check" /></Button>)
    const eventLocator = (<Button variant="fab" size="large" className={props.classes.eventLocator}><Icon className="fa fa-location-arrow" style={{transform: 'rotate('+eventBearing+'deg)'}}/></Button>)

    const haveCheckedIn = props.checkedIn
    const distanceFromHere = distance(props.currentLocation ? props.currentLocation : props.event.geo, props.event.geo, {units: 'miles'})
    const isNearby = distanceFromHere < 0.5
    const canCheckIn = !haveCheckedIn && props.onCheckIn && isNearby
    const cardColor = colorForEvent(props.event)
    const textColor = fontColorContrast(cardColor)
    const attendeeCount = props.event.attendees.length - (haveCheckedIn ? 1 : 0)

    const background = '-webkit-linear-gradient(left, ' + cardColor + ' 0%, ' + cardColor + 'aa 70%, ' + cardColor + '00 100%)'

    return (
        <Card style={{backgroundColor: cardColor, color: textColor}}>
            <CardContent style={{position: 'relative', zIndex: 1}}>
                <div style={{width: '175%', height: '100%', overflow: 'hidden', top: 0, left: 0, flex: 'auto', display: 'flex', position: 'absolute', zIndex: -1}}>
                    <BaseMap zoomControl={false} zoom={15} center={getCoords(props.event.geo)} style={{position: 'relative', width: 'inherit', height: 'inherit', flex: 'auto'}}>
                        <Marker position={getCoords(props.event.geo)} />
                    </BaseMap>
                </div>
                <div style={{width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', zIndex: -1, background: background}} />
                <Grid style={{flexWrap: 'nowrap'}} direction="row" spacing={8} alignItems="stretch" container>
                    <Grid xs={2} style={{fontSize: 'x-small', textAlign: 'center'}} item>
                        {(isNearby || haveCheckedIn) ? null : eventLocator}
                        {canCheckIn ? checkInButton : null}
                        {haveCheckedIn ? checkedInBadge : null}
                        {haveCheckedIn ? (<p>You checked in</p>) : (<p><em>{attendeeCount > 0 ? attendeeCount + ' other people checked in' : (canCheckIn ? 'Be the first to check in!' : null)}</em></p>)}
                    </Grid>
                    <Grid xs={10} item>
                        <Typography variant="headline">{props.event.name}</Typography>
                        <Typography variant="subheading">{moment(props.event.timestamp).calendar()}</Typography>
                        <p>{locationDisplay(props.event, props.currentLocation)}</p>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

EventCard.propTypes = {
    event: PropTypes.object,
    currentLocation: PropTypes.object
}

EventCard.defaultProps = {
    classes: {}
}

const mapStateToProps = (state, props) => {
    const currentUser = getCurrentUser(state)
    const evt = Events.select(state).withGeo().get(props.event_id)
    const checkedIn = evt.attendees.indexOf(_.get(currentUser, 'email')) != -1
    const currentLocation = getCurrentLocation(state)
    return {
        event: evt,
        checkedIn,
        currentLocation
    }
}

const styles = {
    checkedInBadge: {
        backgroundColor: '#3a5',
        minWidth: 0
    },
    checkInButton: {
        backgroundColor: '#ddd',
        minWidth: 0
    },
    eventLocator: {
        backgroundColor: '#33f',
        minWidth: 0
    }
}

export default withStyles(styles)(connect(mapStateToProps)(EventCard))
