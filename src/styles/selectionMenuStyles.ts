
/**
 * Styles for the react-select dropdown menu.
 */
export const selectionMenuStyles = {
    singleValue: (styles: any) => ({ // This section refers to the value/label when the dropdown is closed (not expended)
        ...styles, 
        color: "#fff", // Set the text color to white
        fontSize: "0.8rem",
        lineHeight: ".75rem",
    }),

    control: (styles: any) => ({ // This section refers to the dropdown menu when closed (not expended)
        ...styles,
        width: "100%",
        maxWidth: "14rem",
        minWidth: "12rem",
        borderRadius: "5px",
        color: "#fff",
        fontSize: "0.8rem",
        lineHeight: ".75rem",
        backgroundColor: "rgb(40,40,40)", // bg-dark-layer-1
        cursor: "pointer",
        border: "2px solid #000000",
        ":hover": {
            border: "2px solid #000000",
            boxShadow:  "2px 0px 2px 2px rgb(179 179 179);",
        },
    }),

    option: (styles: any) => { // This section refers to the expended dropdown menu
        return {
            ...styles,
            color: "#fff",
            fontSize: "0.8rem",
            lineHeight: ".75rem",
            width: "100%",
            background: "rgb(40,40,40)", // bg-dark-layer-1
            ":hover": {
                backgroundColor: "rgb(179, 179, 179)",
                color: "#000",
                cursor: "pointer",
            },
        };
    },

    menu: (styles: any) => {
        return {
            ...styles,
            backgroundColor: "rgb(40,40,40)", // bg-dark-layer-1
            maxWidth: "14rem",
            border: "2px solid #000000",
            borderRadius: "5px",
            boxShadow: "5px 5px 0px 0px rgb(26,26,26);",
        };
    },

    placeholder: (defaultStyles: any) => {
        return {
            ...defaultStyles,
            color: "#fff",
            fontSize: "0.8rem",
            lineHeight: "1.75rem",
        };
    },
  };
  