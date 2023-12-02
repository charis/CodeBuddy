// Library imports
import Image from 'next/image';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsCheck2Circle } from 'react-icons/bs';
// Custom imports
import ChatUI from "@/components/chatbot/ChatUI";
import MessagesProvider from "@/context/messages";
import { DBProblem, LocalProblem } from "@/types";
import "@/styles/react-tabs.css";

type SidebarProps = {
    localProblem: LocalProblem,
    dbProblem: DBProblem | null,
    isCorrect: boolean
};

const Sidebar:React.FC<SidebarProps> = ({localProblem, dbProblem, isCorrect}) => {
    /** The color of the difficulty based on its value */
    const difficultyColor = dbProblem?.difficulty === 'Easy'   ? "text-olive bg-olive" :
                            dbProblem?.difficulty === 'Medium' ? "text-dark-yellow bg-dark-yellow"  : "text-dark-pink bg-dark-pink ";

    return (
      <MessagesProvider>
        <div className="bg-dark-layer-1">
          {/*   T A B S   */}
          <Tabs>
            <TabList>
              <Tab>
                <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
                  <div className={'bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer'}>
                    <p className="font-medium">Description</p>
                  </div>
                </div>
              </Tab>
  
              <Tab>
                <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
                  <div className={'bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer'}>
                    <div className="flex gap-2.5 items-center">
                      <p className="w-2 h-2 rounded-full animate-pulse bg-green-500"/>
                      <p className="font-medium">Virtual TA</p>
                    </div>
                  </div>
                </div>
              </Tab>
            </TabList>
  
            {/* ------------------------------------------ */}
            {/*   P R O B L E M    D E S C R I P T I O N   */}
            {/* ------------------------------------------ */}
            <TabPanel>
              <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="px-5">
                  <div className="w-full">
                    <div className="flex space-x-4">
                      {/*   P r o b l e m   Title   */}
                      <div className="flex-1 mr-2 text-lg text-white font-medium">
                        {dbProblem?.order + '. ' + dbProblem?.title}
                      </div>
                    </div>
                    <div className="flex items-center mt-3">
                      {/*   P r o b l em   D i f f i c u l t y   */}
                      <div className={`${difficultyColor} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}>
                        {dbProblem?.difficulty}
                      </div>
                      {/*   S h o w   i f   t h e   u s e r   h a s   s o l v e d   t h e   p r o b l e m   */}
                      {isCorrect && (
                        <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                          <BsCheck2Circle />
                        </div>
                      )}
                    </div>
                  
                    {/*   P r o b l e m   S t a t e m e n t   ( p a r a g r a p h s )   */}
                    <div className="text-white text-sm">
                      <div dangerouslySetInnerHTML={{ __html: localProblem.problemStatement}} />
                    </div>
                    
                    {/*   E x a m p l e s   */}
                    <div className="mt-4">
                      {localProblem.examples.map((example, index) => (
                        <div key={example.id}>
                          <p className="font-medium text-white">Example {index + 1}:</p>
                          { example.image_explanation && ( // The example has an image explanation
                            <Image src={example.image_explanation}
                                   alt={''}
                                   className="mt-3"
                                   height={600}
                                   width={600}
                            />
                          )}
                          <div className="example-card">
                            <pre>
                              <strong className="text-white">Input: </strong>{example.inputText}<br/>
                              <strong>Output:</strong>{example.outputText}<br/>
                              {example.explanation && ( // The example has an explanation
                                 <>
                                   <strong>Explanation: </strong>{example.explanation}
                                 </>
                              )}
                            </pre>
                          </div>
                        </div>
                      ))};
                    </div>
                    
                    {/*   C o n s t r a i n t s   */}
                    <div className="my-5 pb-4">
                      <div className="text-white text-sm font-medium">
                        Constraints:
                      </div>
                      <ul className="text-white ml-5 list-disc">
                        <div dangerouslySetInnerHTML={{ __html: localProblem.constraints }} />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            {/* ------------------------ */}
            {/*   V I R T U A L    T A   */}
            {/* ------------------------ */}
            <TabPanel>
              <div className="px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="w-full">
                  <div className="text-white font-medium">
                    <ChatUI />
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </MessagesProvider>
    );
}
export default Sidebar;