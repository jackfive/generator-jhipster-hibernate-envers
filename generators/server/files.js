/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used.
 */

const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;

const customServerFiles = {
    dbChangelogAudit: [
        {
            condition: generator => generator.databaseType === 'sql' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/initial_schema_aud.xml',
                    renameTo: () => 'config/liquibase/changelog/00000000000000_initial_schema_aud.xml',
                    options: { interpolate: INTERPOLATE_REGEX }
                }
            ]
        }
    ],
    serverBuild: [
        {
            condition: generator => generator.buildTool === 'maven',
            templates: [{ file: 'pom.xml', options: { interpolate: INTERPOLATE_REGEX } }]
        }
    ],
    serverResource: [
        {
            path: SERVER_MAIN_RES_DIR,
            templates: ['config/application.yml']
        }
    ]
};

module.exports = {
    writeFiles
};

function writeFiles() {
    if (this.skipServer) return;

    // write server side files
    this.writeFilesToDisk(customServerFiles, this, false);

    if (this.databaseType === 'sql') {
        if (!this.skipDbChangelog) {
            this.addChangelogToLiquibase('00000000000000_initial_schema_aud');
        }
    }
}
