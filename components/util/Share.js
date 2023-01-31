import {Button, Loading} from "@nextui-org/react";
import {useRouter} from "next/router";
import {Share2Icon} from "@radix-ui/react-icons";
import {useEffect, useState} from "react";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Share() {
    const router = useRouter();
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        return () => {
            if (navigator.canShare) {
                setCanShare(true);
            }
        };
    }, []);

    //<Button light color="primary" auto onPress={() => {
    //             if (navigator.share) {
    //                 navigator.share({
    //                     title: `${document.title}`,
    //                     text: 'Check out this Looped page!',
    //                     url: `${window.location.href}`,
    //                 })
    //             }
    //         }}>
    //             <Share2Icon/>
    //         </Button>
    return (
        <>
            {canShare ? (
                <Button
                    light
                    onClick={() => {
                             navigator.share({
                                 title: `${document.title}`,
                                 text: 'Check out this Looped page!',
                                 url: `${window.location.href}`,
                             })
                            .then(() => console.log('Successful share'))
                            .catch((error) => console.log('Error sharing', error));
                    }}
                 > <Share2Icon/>
                </Button>
            ) : null}
        </>
    )
}
