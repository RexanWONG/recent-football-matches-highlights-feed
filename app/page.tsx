'use client'

import React, { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ModeToggle } from '@/components/mode-toggle';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

interface Fixture {
  title: string;
  embed: string;
}

const page = () => { 
  const [fixtures, setFixtures] = useState<Fixture[]>()
  const [currentSelectedFixtureTitle, setCurrentSelectedFixtureTitle] = useState<string>()
  const [currentEmbed, setCurrentEmbed] = useState<string>()

  const getVideos = async () => {
    const options: AxiosRequestConfig = {
      method: 'GET',  
      url: 'https://free-football-soccer-videos.p.rapidapi.com/',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_X_RapidAPI_KEY as string,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_X_RapidAPI_HOST as string
      }
    };
    
    try {  
      const response = await axios.request(options);
      setFixtures(response.data as [])
    } catch (error) {
      console.error(error);
    }
  }

  function extractIframeSrc(htmlString: string): string | null {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      const iframe = doc.querySelector('iframe');
      return iframe ? iframe.getAttribute('src') : null;
  }
   
  useEffect(() => {
    getVideos()
  }, [])

  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
        {fixtures ? (
           <div className='flex flex-row items-center justify-center mt-10 gap-20'>
              <div>
                <Command className='border rounded-lg w-[300px] min-h-[500px]'>    
                    <CommandInput placeholder="Search for a fixture..." />
                    <CommandList className='min-h-[500px]'>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                          {fixtures.map((fixture) => (
                            <CommandItem 
                                className='hover:cursor-pointer' 
                                onSelect={() => {
                                    setCurrentSelectedFixtureTitle(fixture.title)
                                    setCurrentEmbed(fixture.embed);
                                }}  
                            >
                              {fixture.title}
                            </CommandItem>
                          ))}

                      </CommandGroup>
                    </CommandList>
                </Command>  
              </div>
              {currentEmbed ? (    
                <div className='flex flex-col items-start justify-center bg-transparent'>
                    <iframe 
                        src={extractIframeSrc(currentEmbed || '') || ''}
                        width={800}
                        height={500}
                        allow='autoplay; fullscreen' 
                        className='mb-2'
                    />
                    <div className='flex flex-row items-center justify-center gap-5'>
                        <ModeToggle />
                        <a 
                            href={`https://www.google.com/search?q=${currentSelectedFixtureTitle}&sourceid=chrome&ie=UTF-8`}
                            target='_blank'
                            rel="noopener noreferrer"
                            className='flex flex-row items-center justify-center gap-2 hover:text-muted-foreground'
                        >
                            View more about this game <ArrowTopRightIcon />
                        </a>
                    </div>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='mb-5'>Click on a game to watch it!</h1>
                    <ModeToggle />
                </div>
              )} 
        </div>
        ) : (
          <></>
        )}
    </div>  
  )
}  

export default page