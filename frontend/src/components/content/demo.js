import {
    useQuery,
    useMutation,
    useQueryClient,
    useIsFetching,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {ListItem, List, Divider, ListItemText, ListItemButton} from "@mui/material";
import { useSpring, animated, useTransition } from '@react-spring/web'
import {BallTriangle, MagnifyingGlass} from "react-loader-spinner";
import { useMeasure} from "react-use";
import {useState, useEffect, MouseEvent} from "react";

import {GetAllDemos} from "../api/demos";


const Demos = () => {

    const defaultHeight = "150px";
    const [contentHeight, setContentHeight] = useState(defaultHeight);
    const [ref, { height }] = useMeasure();

    /* Hit API with a GET for all scans */
    const demo_data = useQuery(['demo'], GetAllDemos)


    const expand = useSpring({
        config: { friction: 10, tension:1000 },
        height: demo_data.isLoading ? defaultHeight : `${contentHeight}px`
    });

    /* Depends on 'height' state - fires on any change to this state and sets div height appropriately*/
    useEffect(() => {
        let temp_height = height + 50
        setContentHeight(temp_height);
        window.addEventListener("resize", setContentHeight(temp_height));
        return window.removeEventListener("resize", setContentHeight(temp_height));
    }, [height]);



    let div = <>
        <div className="demos_container" ref={ref}>
            <div className="header_row">
                <h3>Demonstration Data</h3>
            </div>
            <div className="subheader_row">
                <p>Total Items: {demo_data.data?.length}</p>
            </div>
            <div className="demos">
                <List component="nav" aria-label="scan_data">
                    {demo_data.data?.map(item => ( <>
                            <Divider />
                            <ListItem key={item.id.$oid} button>
                                <ListItemText primary={item.name} />
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </div>
        </div>
    </>;

    return (
        <div className="Demo">
            <animated.div className="scans_container" style={expand}>
                {demo_data.isLoading ? <div className="centered_loading_div"><BallTriangle  /></div> : div}
            </animated.div>
        </div>
    )
}

export default Demos;