import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Tabs,
  Text,
  TextField,
  TextAreaField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
  Card,
  useTheme,
  Table, TableCell, TableBody, TableHead, TableRow,
  Input,
  SelectField,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { NotificationRule } from "aws-cdk-lib/aws-codestarnotifications";

import PlusImage from "./assets/plus.svg";
import MinusImage from "./assets/minus.svg";
import EditImage from "./assets/edit.svg";

import {DiceDefinitions} from "./data/DiceDefinitions.jsx";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

//Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

const ALLOW_DELETING_ATTRIBUTES = false;

export function Attributes() {
    const [showSetup, setShowSetup] = useState(true);
    const [attributes, setAttributes] = useState(
        [
            // {name:"Strength", die:"d4", modifier:""},
            // {name:"Agiligy", die:"d4", modifier:""},
            // {name:"Smarts", die:"d4", modifier:""},
            // {name:"Spirit", die:"d4", modifier:""},
            // {name:"Vigor", die:"d4", modifier:""},
            
        ]
    );

    useEffect(() => {

        let isCurrent = true;

        fetchAttributes();
        return () => {
            isCurrent = false;
        }
  
      }, []);

    async function createAttributeData (event) {
        event.preventDefault();
        const items = ["Strength", "Smarts", "Spirit", "Agility", "Vigor"];
       
        for (let i =0; i<items.length; i++) {
            console.log ("------->", items[i]);

            


                const {errors, data: newItem} =  await client.models.Attr.create( 
                    {
                    name:items[i],
                            die:"d8",
                            modifier:"0"
                    }
                );
                console.log(">>> created Item error:", errors);
                console.log(">>> NewItem:", newItem);
            
        }
        setShowSetup(false);

        event.target.reset();
    }

    async function fetchAttributes() {
        const { data: loadedAttributed } = await client.models.Attr.list();
        console.log(">>>> Fetch Attributes:", loadedAttributed);
        if (loadedAttributed.length > 0) setShowSetup(false);
        setAttributes (loadedAttributed);
    }

    // async function fetchAttributes() {
    //     const { data: loadedAttributed } = await client.models.Attr.list();
    //     console.log(">>> Attributes >>>");
    //     console.log(loadedAttributed);
    //     if (loadedAttributed.length > 0)
    //     {
    //         console.log(">>Set Attributes");
    //         setAttributes(
    //             loadedAttributed
    //         );
    //     } else
    //     {
    //         console.log(">>>Started new Items")
    //         const items = ["Strength", "Smarts", "Spirit", "Agility", "Vigor"];


    //         for (let i =0; i<items.length; i++) {
    //             console.log ("------->", items[i]);

    //             const { data: currentRecords, listError } = await client.models.Attr.list({
    //                 filter: {
    //                   name: {
    //                     beginsWith: items[i]
    //                   }
    //                 }
    //               });
    //               console.log(">>>> Read List:" , currentRecords);
    //               if (currentRecords.length > 0)
    //             { return } 
    //               else {


    //                 const {errors, data: newItem} =  await client.models.Attr.create( 
    //                     {
    //                     name:items[i],
    //                             die:"d8",
    //                             modifier:"0"
    //                     }
    //                 );
    //                 console.log(">>> created Item error:", errors);
    //                 console.log(">>> NewItem:", newItem);
    //             }
    //         }

    //         const { data: loadedAttributed } = await client.models.Attr.list();
    //         setAttributes(loadedAttributed);

    //         // await items.map((attr) => {
    //         //     const {data: newItem} =  client.models.Attribute.create( 
    //         //         {
    //         //            name:attr, die:"d4", modifier:""
    //         //         }
    //         //     );
    //         //     console.log(">>> created Item:", newItem);

    //         // } () );
                

    //         //fetchAttributes();
            
    //     }

    // }

    function Selection ({currentValue}) {

        const choices = [currentValue.die, "d4", "d6", "d8", "d10", "d12"];

        return (
        <SelectField name={currentValue.name} id={currentValue.id} defaultValue={currentValue.die} 
        onChange={updateAttributes}
        label={currentValue.name}
        options={choices}
        labelHidden
      ></SelectField>
        );

    }
    // function Options({currentValue}) {

    //     return (
    //         <>
    //             <option value={currentValue}>{currentValue}</option>
    //             <option value="d4" selected>d4</option>
    //             <option value="d6" selected>d6</option>
    //             <option value="d8" selected>d8</option>
    //             <option value="d10" selected>d10</option>
    //             <option value="d12" selected>d12</option>
    //       </>
    //     )

    // }

    async function deleteAllAttributes(event) {
        const { data: attributes } = await client.models.Attr.list();
        for (let i=0; i<attributes.length; i++ ) {
            console.log(">>> Item to delet:", attributes[i]);
            const { data: deletedNote, errors } = await client.models.Attr.delete(
                attributes[i]
              );
              console.log(">> Delete Errors:", errors);

        }


        // const { data: deletedNote } = await client.models.Gear.delete(
        //           toBeDeletedNote
        //         );
        //         console.log(deletedNote);
        //         fetchGear();

    }

    async function updateAttributesMod(event) {
        event.preventDefault();
        console.log(">>> event >>>");
        console.log(event.target.value);
            //console.log("Item:", item);
            console.log("ID:", event.target.id);
            console.log("Name:", event.target.name);
            

        const {data: updatedSkill, errors} = await client.models.Attr.update( {
          id: event.target.id,
          modifier: event.target.value,
        })
        console.log("errors:")
        console.log(errors);

        // fetchSkills();
        // setTab("1");
        // event.target.reset();
        
        fetchAttributes();
       // event.target.reset();
    }


    async function updateAttributes(event) {
        event.preventDefault();
        console.log(">>> event >>>");
        console.log(event.target.value);
            //console.log("Item:", item);
            console.log("ID:", event.target.id);
            console.log("Name:", event.target.name);
            
        
        // let updateObject = structuredClone(attributes);
        // updateObject[event.target.id].die = event.target.value;
        
        // console.log(">>>> Update Object:",updateObject);

        // const {data: updatedAttributes, errors} = await client.models.Attribute.update( updateObject );
        
        // console.log(">>>> errror:", errors);

       // const form = new FormData(event.target);
        //console.log(">>> Form >>>");
        //console.log(form);
        const {data: updatedSkill, errors} = await client.models.Attr.update( {
          id: event.target.id,
          die: event.target.value,
        })
        console.log("errors:")
        console.log(errors);

        // fetchSkills();
        // setTab("1");
        // event.target.reset();
        
        fetchAttributes();
       // event.target.reset();
    }



    return(
        
          
        <View as="form" margin="3rem 0" >
        <Table
            caption=""
            highlightOnHover={false}
            size="small"
            variation="striped">
            
            
            <TableBody>

 
               { attributes.map((item) => (

            <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                    
                    <Selection  currentValue={item} />
                    </TableCell>
                                    <TableCell> <TextField onChange={updateAttributesMod}
                                    name={item.name}
                                    id={item.id}
                                    placeholder="Mod"
                                    label="Mod"
                                    labelHidden
                                    variation="default"
                                    required
                                    value={item.modifier}
                                  /></TableCell>
            
            </TableRow>
                ))};
                   
                   


            
            </TableBody>
        </Table>

        {ALLOW_DELETING_ATTRIBUTES? <Button onClick={deleteAllAttributes}>Delete all</Button>:""}
        {showSetup?   <Button onClick={createAttributeData}>Setup Attributes</Button>:""}

        </View>
    );
}