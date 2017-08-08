# react-components: In-house components used @ Monadical

These components are not documented or supported, but if you find something you like you're welcome to use it!

## Usage

```javascript
import {ExpandableSection} from 'monadical-react-components'

const MORE_INFO = "https://github.com/Monadical-SAS/react-components"


export const TimeControlsComponent = ({debug, expanded}) =>
    <ExpandableSection name="Controls" source={MORE_INFO} expanded={expanded}>
        Blah Blah Blah content here
    </ExpandableSection>
```
