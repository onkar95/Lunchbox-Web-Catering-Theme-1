import React from "react";
import Lbc from "@lunchboxinc/lunchbox-components";
import {Layout} from "components/elements";
import {ThemeText, View, ThemeButton} from "components/elementsThemed";
import {Errors} from "components/fragments";
import {useTemplateContext} from "components/providers/template";

const {
  Grid: {Row, Col},
} = Lbc;

const {Flex} = Layout;
const Theme = () => {
  const {parsedTheme} = useTemplateContext();

  const {labels, buttons, views} = parsedTheme;

  return (
    <Flex direction="col" justify="space">
      <Row gutter={15}>
        {Object.keys(labels).map(([key]) => (
          <Col>
            <Errors message="An error occured">
              <ThemeText title={key} type={key}>
                {key}
              </ThemeText>
            </Errors>
          </Col>
        ))}
      </Row>

      <br />

      <Row gutter={15}>
        {Object.keys(buttons).map(([key]) => (
          <Col>
            <Errors message="An error occured">
              <ThemeButton type={key}>{key}</ThemeButton>
            </Errors>
          </Col>
        ))}
      </Row>

      <br />

      <Row gutter={15} spacing={15}>
        {Object.keys(views).map(([key]) => (
          <Col xs="1" sm="1-2" md="1-3" lg="1-4" style={{height: "250px"}}>
            <View
              style={{height: "100%"}}
              Component={Flex}
              type={key}
              grow={1}
              align="center"
              justify="center"
            >
              {key}
            </View>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Theme;
