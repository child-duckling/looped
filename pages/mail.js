import Head from 'next/head'
import {hasCookie} from "cookies-next";
import useSWR from "swr";
import {fetcher} from "../libs/sl";
import Load from "../components/util/Loading";
import {Card, Text, Table, Badge} from "@nextui-org/react";
import Link from "next/link";
import No from "../components/util/no";
import { useRouter } from 'next/router';
import { getMail } from './api/_sl/mail_messages';
import {useLocalStorage} from "@react-hooks-library/core";
import {useEffect, useState} from "react";


export default function Mail(props) {

    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }

    const [read, setRead] = useLocalStorage(
        'readMails',
        []
    )


    let {data, error} = useSWR('/api/_sl/mail_messages', fetcher)
    const router = useRouter()

    //data = props.mail

    let mailElement = <Load />
    if (error) mailElement = <Text>Failed to load | {JSON.stringify(props.mail)}</Text>
    if (data) {
        if (data.length > 0) {
            let mail = data.map((mail) => (
                <Table.Row
                    key={mail.ID}
                >
                    <Table.Cell>
                        {read.includes(`${mail.ID}`) || mail.read == 'false' && (
                            <Badge color="primary" variant="dot" />
                        )}

                        {mail.subject}</Table.Cell>
                    <Table.Cell>{String(mail.sender.name).split(', ')[1] + ' ' + String(mail.sender.name).split(', ')[0]}</Table.Cell>
                    <Table.Cell>{new Date(parseInt(String(mail.date))).toLocaleDateString()}</Table.Cell>
                </Table.Row>
            ))

            mailElement = (<Table
                aria-label="Example static collection table"
                compact
                selectionMode="single"
                css={{zIndex: '1'}}
                onSelectionChange={(key) => {

                    router.push(`/mail/${key.currentKey}`)}}
            >
                <Table.Header>
                    <Table.Column>Subject</Table.Column>
                    <Table.Column>From</Table.Column>
                    <Table.Column>Sent</Table.Column>
                </Table.Header>
                <Table.Body>
                    {mail}
            </Table.Body>
            </Table>)

        } else {
            mailElement = <No thing={"News"} />
        }

    }
    const [inPwa, setInPwa] = useState(false);
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setInPwa(true);
        }
    }, [])

    return (
        <>
            <Head>
                <title>LoopMail{ inPwa ? null : `- Looped`}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>  LoopMail</h1>
            {mailElement}
        </>
    )
}

export async function getServerSideProps(context) {

    if (!hasCookie("sl-token", context)) {
        return {
            redirect: {
                destination: `/login?path=/mail`,
                permanent: false
            }
        }
    }

    // Cache it, cause I don't want to grab it again lol.
    context.res.setHeader(
        'Cache-Control',
        'private, s-maxage=600'
    )

    let mail
    try {
        mail = await getMail(getCookie('sl-token', context), getCookie('sl-uid', context));
        return {
            props: {
                error: false,
                mail: mail
            }, // will be passed to the page component as props
        }
    } catch (e) {
        return {
            props: {
                error: true,
                message: e.message
            }
        }
    }
}
