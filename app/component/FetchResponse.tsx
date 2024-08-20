"use client";
import React, {useState, useRef} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@nextui-org/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@nextui-org/input"
import {Textarea} from "@nextui-org/input"
import {Card, CardContent} from "@/components/ui/card";
import {ScrollShadow} from "@nextui-org/scroll-shadow";
import {Spinner} from "@nextui-org/spinner";
import {CirclePlay} from "lucide-react";

const FormSchema = z.object({
    query: z.string().min(2, {
        message: "Query must be at least 2 characters.",
    }),
});

const FAQ_ITEMS = [
    "What is ozempic?",
    "How does ozempic work?",
    "What are the side effects of ozempic?"
];


export function InputForm() {
    const [results, setResults] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isFirstQuery, setIsFirstQuery] = useState(true);
    const abortControllerRef = useRef(null);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            query: "",
        },
    });

    const streamResponse = async (query: string) => {
        setResults('');
        setIsStreaming(true);
        setIsFirstQuery(false);

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const response = await fetch(`https://jftpax5wqp.eu-west-2.awsapprunner.com/stream_query`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query, similarity_top_k: 5}),
                signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            setIsStreaming(false);
                            return;
                        }
                        setResults(prev => prev + data);
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error);
            setResults(`Error: ${error.message}`);
        } finally {
            setIsStreaming(false);
        }
    };

    const onSubmit = (data) => {
        streamResponse(data.query);
    };

    return (
        <div className={"space-y-4 overflow-hidden h-svh"}>
            <div className={"h-[80svh] sm:h-[80svh] flex flex-col sm:flex-row gap-4"}>
                <div className={"w-full sm:w-4/5 h-full"}>
                    <ScrollShadow className="w-full h-full sm:p-0 p-4">
                        <div className={"w-full h-full p-4 pl-0"}>
                            {isFirstQuery && (
                                <div className={"text-xl font-medium"}>
                                    Ask a question or select a frequently asked question to get started about weight loss.
                                </div>
                            )}
                            {isStreaming && results === '' ? (
                                <div className={" flex flex-row justify-center items-center h-full w-full"}>
                                    <Spinner color="primary"/>
                                </div>
                            ) : (
                                <p className={"font-medium text-xl text-opacity-90 text-primary-900 leading-normal"}> {results}</p>
                            )}
                        </div>
                    </ScrollShadow>
                </div>
                <div className={"w-full sm:w-1/5"}>
                    <div className="w-full overflow-x-scroll">
                        <h2 className="text-lg font-semibold mb-2">Frequently Asked Questions</h2>
                        <div className="flex flex-row sm:flex-wrap gap-2 overflow-x-scroll">
                            {FAQ_ITEMS.map((item, index) => (
                                <Button
                                    key={index}
                                    size={"md"}
                                    variant="flat"
                                    className={"block min-w-fit text-wrap"}
                                    fullWidth
                                    onClick={() => streamResponse(item)}
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className={"h-[15svh]"}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({field}) => (
                                <FormItem>
                                    <div className={"flex flex-row gap-1"}>
                                        {/*<FormLabel>Your Question</FormLabel>*/}
                                        <FormControl>
                                            <Input size={"lg"} placeholder="Ask about Ozempic..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                        <Button  isIconOnly size={"lg"} type="submit" disabled={isStreaming}>

                                            {isStreaming ? <CirclePlay/> : <CirclePlay/>}
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />

                    </form>
                </Form>
            </div>


        </div>
    );
}

export default InputForm;