import React from 'react'
import { shallow } from 'enzyme'
import { OrganizerDashboard } from './OrganizerDashboard'
import Immutable from 'immutable'

it('should render default state', () => {
    shallow(<OrganizerDashboard classes={{}} upcomingEvents={Immutable.Map()} previousEvents={Immutable.Map()} currentUser={{}} />)
})
